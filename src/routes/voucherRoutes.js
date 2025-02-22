import express from 'express';
import {
  requestVoucher,
  editRequest,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getAllVouchers,
  getVoucherStatus,
  getVoucherXml
} from '../controllers/voucherController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { validateVoucherRequest, validateVoucherEdit } from '../validators/voucherValidator.js';

const router = express.Router();

router.post('/request', authenticate, validateVoucherRequest, requestVoucher);
router.patch('/request/:id', authenticate, validateVoucherEdit, editRequest);
router.get('/pending', authenticate, isAdmin, getPendingRequests);
router.post('/approve/:id', authenticate, isAdmin, approveRequest);
router.post('/reject/:id', authenticate, isAdmin, rejectRequest);

router.get('/', authenticate, getAllVouchers);
router.get('/status/:voucherId', authenticate, getVoucherStatus);
router.get('/xml/:id', authenticate, getVoucherXml);

export default router;
