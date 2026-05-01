/**
  bcrypt.js
  Shared password hashing and comparison helpers so hashing policy stays consistent everywhere.
 */

import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export default { hashPassword, comparePassword };