import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    lectureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        options: [{
            type: String,
            required: true
        }],
        correctAnswer: {
            type: String,
            required: true
        }
    }],
    studentResponses: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        answers: [{
            questionIndex: Number,
            selectedAnswer: String
        }],
        score: {
            type: Number,
            default: 0
        },
        submittedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz; 