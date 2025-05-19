import asyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";
import { Gamification } from "../models/gamification.model.js";

// Update gamification rankings
const updateRankings = asyncHandler(async () => {
    // Get all students with their total scores
    const students = await User.find({ role: "student" })
        .select("_id name totalScores")
        .sort({ totalScores: -1 });

    // Clear existing rankings
    await Gamification.deleteMany({});

    // Create new rankings for each level
    const diamondLevel = new Gamification({
        level: "diamond",
        students: students.slice(0, 5).map((student, index) => ({
            studentId: student._id,
            totalScore: student.totalScores || 0,
            rank: index + 1
        }))
    });

    const goldLevel = new Gamification({
        level: "gold",
        students: students.slice(5, 10).map((student, index) => ({
            studentId: student._id,
            totalScore: student.totalScores || 0,
            rank: index + 6  // Start rank from 6
        }))
    });

    const silverLevel = new Gamification({
        level: "silver",
        students: students.slice(10, 15).map((student, index) => ({
            studentId: student._id,
            totalScore: student.totalScores || 0,
            rank: index + 11  // Start rank from 11
        }))
    });

    const bronzeLevel = new Gamification({
        level: "bronze",
        students: students.slice(15, 20).map((student, index) => ({
            studentId: student._id,
            totalScore: student.totalScores || 0,
            rank: index + 16  // Start rank from 16
        }))
    });

    // Save all levels
    await Promise.all([
        diamondLevel.save(),
        goldLevel.save(),
        silverLevel.save(),
        bronzeLevel.save()
    ]);

    return { success: true, message: "Rankings updated successfully" };
});

// Get all rankings
const getRankings = asyncHandler(async (req, res) => {
    const rankings = await Gamification.find()
        .populate("students.studentId", "name photoUrl")
        .sort({ level: 1 });

    res.status(200).json({
        success: true,
        data: rankings
    });
});

// Get student's level and rank
const getStudentRanking = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    const ranking = await Gamification.findOne({
        "students.studentId": studentId
    }).populate("students.studentId", "name photoUrl");

    if (!ranking) {
        return res.status(404).json({
            success: false,
            message: "Student ranking not found"
        });
    }

    const studentRank = ranking.students.find(
        student => student.studentId._id.toString() === studentId
    );

    res.status(200).json({
        success: true,
        data: {
            level: ranking.level,
            rank: studentRank.rank,
            totalScore: studentRank.totalScore
        }
    });
});

// Handle manual update endpoint
const handleUpdateRankings = asyncHandler(async (req, res) => {
    const result = await updateRankings();
    res.status(200).json(result);
});

export {
    updateRankings,
    getRankings,
    getStudentRanking,
    handleUpdateRankings
}; 