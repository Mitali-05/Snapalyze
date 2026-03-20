import express from 'express';
import {
  userRegistrationValidation,
  userLoginValidation,
} from '../validations/userValidation.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserById,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.post('/register',                    userRegistrationValidation, registerUser);
router.post('/login',                       userLoginValidation,        loginUser);
router.post('/forgot-password',             forgotPassword);
router.post('/reset-password/:token',       resetPassword);

// Protected
router.get( '/profile',                     authenticateUser, getUserProfile);
router.put( '/update/:userId',              authenticateUser, updateUserById);
router.post('/change-password',             authenticateUser, changePassword);

export default router;