import VoucherCode from '../models/VoucherCode.js';
import { generateVouchers } from './xmlService.js';

/**
 * Generate and store voucher codes in the database.
 * @param {ObjectId} voucherId - The ID of the approved voucher request.
 * @param {Array} amounts - The voucher amounts and their count.
 * @returns {Array} - List of created voucher codes.
 */
export const generateAndStoreVoucherCodes = async (voucherId, vouchers) => {
  // Prepare bulk insert data
  const voucherCodes = vouchers.map(v => ({
    voucherId,
    custMvtCode: v.custMvtCode,
    custMvtType: v.custMvtType,
    status: v.status,
    transactionIssue: v.transactionIssue,
    dateIssue: v.dateIssue,
    amountType: v.amountType,
    usedAmountType: v.usedAmountType,
  }));

  // Insert all voucher codes into the database
  const savedVouchers = await VoucherCode.insertMany(voucherCodes);

  return savedVouchers;
};
export const getAllVouchers = async () => {
    return await VoucherCode.find();
  };
  
  export const getVouchersByVoucherId = async (voucherId) => {
    return await VoucherCode.find({ voucherId });
  };