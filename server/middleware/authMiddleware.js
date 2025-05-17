import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ errors: [{ msg: 'No token, authorization denied' }] });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ errors: [{ msg: 'User not found' }] });
    }

    req.user = user;  // attach user to request
    next();
  } catch (error) {
    console.error('JWT verification error:', error); // Log actual error
    res.status(401).json({ errors: [{ msg: 'Token is not valid' }] });
  }
};
