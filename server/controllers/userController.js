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
    firstName,    // Expect firstName and lastName in the request body
    lastName,
    email,
    password,
    confirmPassword,
    role,
    profession,
    dob,
    organization,
    profileImage,
  } = req.body;

  // Validate password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ errors: [{ msg: 'Passwords do not match' }] });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errors: [{ msg: 'User already exists with this email' }] });
    }

    // Hash the password securely with a salt rounds of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      profession,
      dob,
      organization,
      profileImage, // optional field; defaults handled by schema
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Registration error:', error.message || error); // Log error to server logs for debugging
    res.status(500).json({ errors: [{ msg: 'Registration failed, please try again later.' }] });
  }
};


// Login User Controller
// Login User Controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Email is incorrect' }] });  // Email not found
    }

    // If the email is found, check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Password is incorrect' }] });  // Password doesn't match
    }

    // Update the last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token with expiration time of 1 hour
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Login error:', error); // Log the error for debugging
    res.status(500).json({ errors: [{ msg: 'Server error, please try again later' }] });
  }
};



// Get User Profile Controller
export const getUserProfile = async (req, res) => {
  try {
    // Fetch user profile excluding the password
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error('Get profile error:', error); // Log error to server logs for debugging
    res.status(500).json({ errors: [{ msg: 'Server error, please try again later' }] });
  }
};
