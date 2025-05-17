import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Register User Controller
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    role,
    profession,
    dob,
    organization,
    profileImage,
    planType = 'Free', // Default to Free if not provided
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ errors: [{ msg: 'Passwords do not match' }] });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errors: [{ msg: 'User already exists with this email' }] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Set limits based on planType
    let dailyUploadLimit = 2;
    let storageLimit = 10_000_000; // 10MB for Free

    if (planType === 'Pro') {
      dailyUploadLimit = 10;
      storageLimit = 100_000_000; // 100MB
    } else if (planType === 'Enterprise') {
      dailyUploadLimit = 50;
      storageLimit = 1_000_000_000; // 1GB
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      profession,
      dob,
      organization,
      profileImage,
      planType,
      dailyUploadLimit,
      storageLimit,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error.message || error);
    res.status(500).json({ errors: [{ msg: 'Registration failed, please try again later.' }] });
  }
};

// Login User Controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Email is incorrect' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Password is incorrect' }] });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
console.log('Logged in user ID:', user._id);
    res.status(200).json({ message: 'Login successful', userId: user._id,token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ errors: [{ msg: 'Server error, please try again later' }] });
  }
};

// Get User Profile Controller
// Get User Profile Controller
export const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ errors: [{ msg: 'Server error, please try again later' }] });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Optional: restrict which fields can be updated for security
    // e.g., delete updates.password; or validate fields before update

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};