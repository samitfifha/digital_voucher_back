import express from 'express';
import { getEmittedStats, getUsedStats } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/stats/emitted', authenticate, isAdmin, getEmittedStats);
router.get('/stats/used', authenticate, isAdmin, getUsedStats);

export default router;