import {
  createVoucherRequest,
  updateVoucherRequest,
  approveVoucherRequest,
  rejectVoucherRequest
} from '../services/voucherService.js';
import Voucher from '../models/Voucher.js';
import Users from '../models/User.js';


export const requestVoucher = async (req, res) => {
  try {
    const voucher = await createVoucherRequest(req.user._id, req.body.amounts, req.body.description);
    res.status(201).json(voucher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editRequest = async (req, res) => {
  try {
    const voucher = await updateVoucherRequest(req.params.id, req.user._id, req.body.amounts, req.body.description);
    res.json(voucher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPendingRequests = async (req, res) => {
  const requests = await Voucher.find({ status: 'pending' })
  .populate('userId', 'email');
  res.json(requests);
};

export const approveRequest = async (req, res) => {
  try {
    const adminEmail = req.user.email;
    const voucher = await approveVoucherRequest(req.params.id, adminEmail);
    res.json({ message: 'Voucher approved and XML generated', voucher });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const voucher = await rejectVoucherRequest(req.params.id);
    res.json({ message: 'Voucher rejected', voucher });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllVouchers = async (req, res) => {
  const vouchers = await Voucher.find({});
  res.json(vouchers);
};

export const getVoucherStatus = async (req, res) => {
  const voucher = await Voucher.findById(req.params.voucherId);
  if (!voucher) {
    return res.status(404).json({ message: 'Voucher not found' });
  }
  res.json({ status: voucher.status });
};

export const getVoucherXml = async (req, res) => {
  const voucher = await Voucher.findById(req.params.id);
  if (!voucher || !voucher.generatedFile) {
    return res.status(404).json({ message: 'Voucher not found or no XML generated' });
  }
  res.download(voucher.generatedFile);
};
