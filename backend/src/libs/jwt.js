// jwt.js - Low-level JWT helper functions shared across auth and middleware, kept separate from business-specific token policy.

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export default { generateToken, verifyToken };