import express from 'express';
import {
  userRegistrationValidation,
  userLoginValidation,
} from '../validations/userValidation.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserById
   // <-- we'll create this controller next
} from '../controllers/userController.js';

import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// User Registration Route
router.post('/register', userRegistrationValidation, registerUser);

// User Login Route
router.post('/login', userLoginValidation, loginUser);

// Get user profile (authenticated)
router.get('/profile', authenticateUser, getUserProfile);

// Update user by userId (authenticated)
router.put('/update/:userId', authenticateUser, updateUserById);

export default router;
