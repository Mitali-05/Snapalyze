import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { getPasswordErrors, generateResetToken, hashToken } from '../utils/passwordUtils.js';
import { sendPasswordResetEmail } from '../utils/emailUtils.js';

// ─── Register ────────────────────────────────────────────────────────────────
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { firstName, lastName, email, password, confirmPassword,
          role, profession, organization, planType = 'Free' } = req.body;

  if (password !== confirmPassword)
    return res.status(400).json({ errors: [{ msg: 'Passwords do not match' }] });

  // Server-side password strength check
  const pwdErrors = getPasswordErrors(password);
  if (pwdErrors.length)
    return res.status(400).json({ errors: pwdErrors.map((msg) => ({ msg })) });

  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ errors: [{ msg: 'An account with this email already exists' }] });

    const hashedPassword = await bcrypt.hash(password, 10);

    const planLimits = {
      Free:       { dailyUploadLimit: 2,  storageLimit: 10_000_000 },
      Pro:        { dailyUploadLimit: 10, storageLimit: 100_000_000 },
      Enterprise: { dailyUploadLimit: 50, storageLimit: 1_000_000_000 },
    };
    const { dailyUploadLimit, storageLimit } = planLimits[planType] ?? planLimits.Free;

    await new User({
      firstName, lastName, email,
      password: hashedPassword,
      role, profession, organization,
      planType, dailyUploadLimit, storageLimit,
    }).save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ errors: [{ msg: 'Registration failed, please try again later.' }] });
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ errors: [{ msg: 'Email is incorrect' }] });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ errors: [{ msg: 'Password is incorrect' }] });

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({ message: 'Login successful', userId: user._id, token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ errors: [{ msg: 'Server error, please try again later' }] });
  }
};

// ─── Get Profile ─────────────────────────────────────────────────────────────
export const getUserProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

// ─── Update User ─────────────────────────────────────────────────────────────
export const updateUserById = async (req, res) => {
  try {
    const { password, role, ...safeUpdates } = req.body; // strip sensitive fields
    const user = await User.findByIdAndUpdate(req.params.userId, safeUpdates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'User updated successfully', user });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── Forgot Password ─────────────────────────────────────────────────────────
/**
 * POST /api/users/forgot-password
 * Body: { email }
 * Always responds with 200 to prevent email enumeration attacks.
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return 200 even if user not found (prevents email enumeration)
    if (!user) {
      return res.status(200).json({
        message: 'If that email is registered, a reset link has been sent.',
      });
    }

    const { rawToken, hashedToken, expires } = generateResetToken();

    user.passwordResetToken   = hashedToken;
    user.passwordResetExpires = expires;
    await user.save();

    await sendPasswordResetEmail(user.email, rawToken, user.firstName);

    return res.status(200).json({
      message: 'If that email is registered, a reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
/**
 * POST /api/users/reset-password/:token
 * Body: { password, confirmPassword }
 */
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword)
    return res.status(400).json({ message: 'All fields are required' });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match' });

  const pwdErrors = getPasswordErrors(password);
  if (pwdErrors.length)
    return res.status(400).json({ errors: pwdErrors.map((msg) => ({ msg })) });

  try {
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      passwordResetToken:   hashedToken,
      passwordResetExpires: { $gt: new Date() }, // not expired
    });

    if (!user)
      return res.status(400).json({ message: 'Reset link is invalid or has expired.' });

    user.password             = await bcrypt.hash(password, 10);
    user.passwordResetToken   = null;
    user.passwordResetExpires = null;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ─── Change Password (authenticated) ─────────────────────────────────────────
/**
 * POST /api/users/change-password
 * Requires auth. Body: { currentPassword, newPassword, confirmNewPassword }
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword)
    return res.status(400).json({ message: 'All fields are required' });

  if (newPassword !== confirmNewPassword)
    return res.status(400).json({ message: 'New passwords do not match' });

  const pwdErrors = getPasswordErrors(newPassword);
  if (pwdErrors.length)
    return res.status(400).json({ errors: pwdErrors.map((msg) => ({ msg })) });

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Current password is incorrect' });

    if (currentPassword === newPassword)
      return res.status(400).json({ message: 'New password must be different from current password' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};