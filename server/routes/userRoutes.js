import express from 'express';
import {
  userRegistrationValidation,
  userLoginValidation,
} from '../validations/userValidation.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
} from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// User Registration Route
router.post('/register', userRegistrationValidation, registerUser);

// User Login Route
router.post('/login', userLoginValidation, loginUser);

// Protected User Profile Route
router.get('/profile', authenticateUser, getUserProfile);

export default router;
