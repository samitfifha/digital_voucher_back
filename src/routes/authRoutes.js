import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import authValidator from '../validators/authValidator.js';

const router = express.Router();

// Public route
router.post('/login', authValidator.validateLogin, authController.login);

// Authenticated routes
router.get('/me', authenticate, authController.getProfile);
router.patch('/me', authenticate, authValidator.validateProfileUpdate, authController.updateProfile);
router.patch('/me/password', authenticate, authValidator.validateChangePassword, authController.changePassword);
router.get('/me/requests', authenticate, authController.getMyRequests);

export default router;
