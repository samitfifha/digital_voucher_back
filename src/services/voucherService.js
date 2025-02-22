import Voucher from '../models/Voucher.js';
import User from '../models/User.js';
import { generateVoucherXmlFile } from '../services/xmlService.js';
import { generateVoucherExcelFile } from '../services/excelService.js'; // Import the new Excel service
import { generateVouchers } from '../services/xmlService.js'; // Import the new voucher service
import { sendApprovalEmails } from '../helpers/emailHelpers.js'; // Import the new email helper
import { generateAndStoreVoucherCodes } from './voucherCodeService.js'; // Import the new voucher code service
export const createVoucherRequest = async (userId, amounts, description) => {
  const voucher = new Voucher({ userId, amounts, description });
  await voucher.save();
  return voucher;
};

export const updateVoucherRequest = async (voucherId, userId, amounts, description) => {
  const voucher = await Voucher.findOne({ _id: voucherId, userId });

  if (!voucher) {
    throw new Error('Voucher not found or unauthorized');
  }

  if (amounts) voucher.amounts = amounts;
  if (description) voucher.description = description;
  
  await voucher.save();
  return voucher;
};

export const approveVoucherRequest = async (voucherId, adminEmail) => {
  // Find the voucher and populate the user's email
  const voucher = await Voucher.findById(voucherId).populate('userId', 'email');

  if (!voucher) {
    throw new Error('Voucher request not found');
  }

  if (voucher.status === 'approved') {
    throw new Error('Already approved');
  }

  voucher.status = 'approved';
  // Generate XML file
  const xmlFileName = generateVoucherXmlFile(voucher.amounts);
  // Generate vouchers for Excel file
  const vouchers = generateVouchers(voucher.amounts);
  // Generate Excel file (Fixed: Await the function)
  const excelFileName = await generateVoucherExcelFile(vouchers);
 // Generate and store voucher codes in MongoDB
 await generateAndStoreVoucherCodes(voucher._id, voucher.amounts);
  // Save the generated file names to the voucher
  voucher.generatedFiles = {
    xmlFile: xmlFileName,
    excelFile: excelFileName,
  };

  await voucher.save();

  // Fetch the user's email from the voucher
  const userEmail = voucher.userId.email;
  // Send approval emails to admin and user
  await sendApprovalEmails(adminEmail, userEmail, xmlFileName, excelFileName);

  return voucher;
};


export const rejectVoucherRequest = async (voucherId) => {
  const voucher = await Voucher.findById(voucherId);

  if (!voucher) {
    throw new Error('Voucher request not found');
  }

  if (voucher.status === 'approved') {
    throw new Error('Cannot reject an already approved request');
  }

  voucher.status = 'rejected';
  await voucher.save();
  return voucher;
};
