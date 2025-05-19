import express from 'express';
import {
    updateRankings,
    getRankings,
    getStudentRanking,
    handleUpdateRankings
} from '../controllers/gamification.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Update rankings (admin only)
router.post('/update', isAuthenticated, handleUpdateRankings);

// Get all rankings
router.get('/', isAuthenticated, getRankings);

// Get student's ranking
router.get('/student/:studentId', isAuthenticated, getStudentRanking);

export default router; 