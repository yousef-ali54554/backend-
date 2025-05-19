import mongoose from "mongoose";

const gamificationSchema = new mongoose.Schema({
    level: {
        type: String,
        enum: ["diamond", "gold", "silver", "bronze"],
        required: true
    },
    students: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        totalScore: {
            type: Number,
            required: true
        },
        rank: {
            type: Number,
            required: true
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const Gamification = mongoose.model("Gamification", gamificationSchema); 