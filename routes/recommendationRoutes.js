import express from 'express';
import { getRecommendation } from '../controllers/recommendationController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Get recommendations
router.post('/recommend', isAuthenticated, getRecommendation);

export default router; 