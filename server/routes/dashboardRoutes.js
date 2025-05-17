import express from 'express';
import { getUserDashboard } from '../controllers/dashboardController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected dashboard route
router.get('/', authenticateUser, getUserDashboard);

export default router;
