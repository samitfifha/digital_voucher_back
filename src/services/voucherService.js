import Voucher from '../models/Voucher.js';
import User from '../models/User.js';
import { generateVoucherXmlFile } from '../services/xmlService.js';
import { generateVoucherExcelFile } from '../services/excelService.js'; // Import the new Excel service
import { generateVouchers } from '../services/xmlService.js'; // Import the new voucher service
import { sendApprovalEmails } from '../helpers/emailHelpers.js'; // Import the new email helper
import { generateAndStoreVoucherCodes } from './voucherCodeService.js'; // Import the new voucher code service
import { generatePdf } from '../services/pdfVoucherService.js'; // Import the new PDF service

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

  // Generate vouchers once
  const vouchers = generateVouchers(voucher.amounts);
  // Generate XML file using the same vouchers
  const xmlFileName = generateVoucherXmlFile(vouchers);

  // Generate Excel file using the same vouchers (Fixed: Await the function)
  const excelFileName = await generateVoucherExcelFile(vouchers);

  // Generate and store voucher codes in MongoDB using the same vouchers
  await generateAndStoreVoucherCodes(voucher._id, vouchers);

  // Generate PDF file
  const pdfFileName = `vouchers_${voucherId}.pdf`;
  await generatePdf(vouchers, `src/assets/${pdfFileName}`);
  // Save the generated file names to the voucher
  voucher.generatedFiles = {
    xmlFile: xmlFileName,
    excelFile: excelFileName,
    pdfFile: pdfFileName,
  };

  await voucher.save();

  // Fetch the user's email from the voucher
  const userEmail = voucher.userId.email;

  // Send approval emails to admin and user
  await sendApprovalEmails(adminEmail, userEmail, xmlFileName, excelFileName, pdfFileName);

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
