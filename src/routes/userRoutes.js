import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/create', authenticate, isAdmin, userController.createUser);
router.get('/', authenticate, isAdmin, userController.getAllUsers);
router.get('/:id', authenticate, isAdmin, userController.getUserById);
router.patch('/:id', authenticate, isAdmin, userController.updateUser);
router.get('/:id/requests', authenticate, isAdmin, userController.getUserRequests);

export default router;
