import express from 'express';
import {
    createQuiz,
    getQuizByLecture,
    submitQuiz,
    getStudentQuizResults
} from '../controllers/quiz.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Create quiz (instructor only)
router.post('/', isAuthenticated, createQuiz);

// Get quiz for a lecture
router.get('/lecture/:lectureId', isAuthenticated, getQuizByLecture);

// Submit quiz answers
router.post('/:quizId/submit', isAuthenticated, submitQuiz);

// Get student's quiz results
router.get('/:quizId/results/:studentId', isAuthenticated, getStudentQuizResults);

export default router; 