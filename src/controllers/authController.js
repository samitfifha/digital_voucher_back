import authService from '../services/authService.js';
import logger from '../utils/logger.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, role } = await authService.loginUser(email, password);

    res.json({ success: true, token,role});
  } catch (error) {
    logger.error(`Login failed: ${error.message}`);
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    logger.error(`Error fetching profile: ${error.message}`);
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await authService.updateUserProfile(req.user._id, req.body);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    logger.error(`Error updating profile: ${error.message}`);
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    await authService.changeUserPassword(req.user._id, req.body.oldPassword, req.body.newPassword);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    logger.error(`Password change failed: ${error.message}`);
    next(error);
  }
};

export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await authService.getUserRequests(req.user._id);
    res.json({ success: true, requests });
  } catch (error) {
    logger.error(`Error fetching requests: ${error.message}`);
    next(error);
  }
};
