import Voucher from '../models/Voucher.js';

export const getEmittedStats = async (req, res) => {
  const { groupBy, startDate, endDate } = req.query;
  // Implement logic to group vouchers by date (daily, weekly, monthly)
  res.json({ message: 'Emitted stats endpoint' });
};

export const getUsedStats = async (req, res) => {
  const { groupBy, startDate, endDate } = req.query;
  // Implement logic to group used vouchers by date (daily, weekly, monthly)
  res.json({ message: 'Used stats endpoint' });
};