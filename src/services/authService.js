import User from '../models/User.js';
import Voucher from '../models/Voucher.js';
import { generateToken } from '../utils/jwt.js';
import logger from '../utils/logger.js';

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid email or password');
  }
  
  logger.info(`User logged in: ${email}`);
  return {
    token: generateToken(user._id),
    role: user.role, // Assuming `role` is a field in your User model
  };
};

const updateUserProfile = async (userId, { name, email }) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId, 
    { name, email }, 
    { new: true, runValidators: true }
  );
  
  if (!updatedUser) {
    throw new Error('User not found');
  }

  logger.info(`Profile updated: ${userId}`);
  return updatedUser;
};

const changeUserPassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user || !(await user.comparePassword(oldPassword))) {
    throw new Error('Invalid password');
  }

  user.password = newPassword;
  await user.save();
  logger.info(`Password changed for user: ${userId}`);
};

const getUserRequests = async (userId) => {
  return await Voucher.find({ userId });
};

export default {
  loginUser,
  updateUserProfile,
  changeUserPassword,
  getUserRequests
};
