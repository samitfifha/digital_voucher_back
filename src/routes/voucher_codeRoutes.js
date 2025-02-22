import express from 'express';
import {
    getVouchers,
    getVouchersById
} from '../controllers/voucher_codeController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/',authenticate,isAdmin, getVouchers);
router.get('/:voucherId',authenticate,isAdmin, getVouchersById);

export default router;
