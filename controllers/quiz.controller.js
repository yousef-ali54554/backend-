import Quiz from '../models/quiz.model.js';
import { User } from '../models/user.model.js';
import asyncHandler from 'express-async-handler';
import { updateRankings } from './gamification.controller.js';

// Create a new quiz for a lecture
const createQuiz = asyncHandler(async (req, res) => {
    const { lectureId, courseId, questions } = req.body;

    const quiz = await Quiz.create({
        lectureId,
        courseId,
        questions
    });

    res.status(201).json(quiz);
});

// Get quiz for a specific lecture
const getQuizByLecture = asyncHandler(async (req, res) => {
    const { lectureId } = req.params;
    const quiz = await Quiz.findOne({ lectureId });
    
    if (!quiz) {
        return res.status(404).json({
            success: false,
            message: 'No quiz found for this lecture'
        });
    }

    res.status(200).json({
        success: true,
        quiz
    });
});

// Submit quiz answers
const submitQuiz = asyncHandler(async (req, res) => {
    const { quizId } = req.params;
    const { studentId, answers } = req.body;

    if (!studentId) {
        return res.status(400).json({
            success: false,
            message: 'Student ID is required'
        });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return res.status(404).json({
            success: false,
            message: 'Quiz not found'
        });
    }

    // Check if student has already submitted
    const existingResponse = quiz.studentResponses.find(
        response => response.studentId.toString() === studentId
    );

    if (existingResponse) {
        return res.status(400).json({
            success: false,
            message: 'You have already submitted this quiz'
        });
    }

    // Calculate score
    let score = 0;
    answers.forEach((answer, index) => {
        if (answer.selectedAnswer === quiz.questions[answer.questionIndex].correctAnswer) {
            score++;
        }
    });

    // Add new student response
    quiz.studentResponses.push({
        studentId,
        answers,
        score,
        submittedAt: new Date()
    });

    await quiz.save();

    // Update user's total scores
    const user = await User.findById(studentId);
    if (user) {
        user.totalScores = (user.totalScores || 0) + score;
        await user.save();

        // Update gamification rankings
        try {
            await updateRankings();
        } catch (error) {
            console.error('Error updating rankings:', error);
        }
    }

    res.status(200).json({
        success: true,
        score,
        totalQuestions: quiz.questions.length
    });
});

// Get student's quiz results
const getStudentQuizResults = asyncHandler(async (req, res) => {
    const { quizId, studentId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return res.status(404).json({
            success: false,
            message: 'Quiz not found'
        });
    }

    const studentResponse = quiz.studentResponses.find(
        response => response.studentId.toString() === studentId
    );

    if (!studentResponse) {
        return res.status(404).json({
            success: false,
            message: 'Student response not found'
        });
    }

    res.status(200).json({
        success: true,
        response: studentResponse
    });
});

export {
    createQuiz,
    getQuizByLecture,
    submitQuiz,
    getStudentQuizResults
}; 