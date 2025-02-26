
// emailHelpers.js
import path from 'path';
import { sendEmailWithAttachments } from '../services/mailerService.js';

/**
 * Send approval emails to the admin and user
 * @param {string} adminEmail - Admin email address
 * @param {string} userEmail - User email address
 * @param {string} xmlFilePath - Path to the XML file
 * @param {string} excelFilePath - Path to the Excel file
 */
export const sendApprovalEmails = async (adminEmail, userEmail, xmlFilePath, excelFilePath, pdfFileName) => {
    const subject = 'Voucher Approval Confirmation';
    const text = 'Your voucher request has been approved. Please find the attached files for details.';
  
    // Attachments for the email
    const attachments = [
      {
        filename: 'vouchers.xml',
        path: xmlFilePath,
      },
      {
        filename: 'vouchers.xlsx',
        path: excelFilePath,
      },
      {
        filename: pdfFileName,
        path: path.join(process.cwd(), 'src', 'assets', pdfFileName),
      },
    ];
  
    try {
      // Send one email to the user and CC the admin
      await sendEmailWithAttachments(userEmail, adminEmail, subject, text, attachments);
    } catch (error) {
      throw new Error(`Failed to send approval emails: ${error.message}`);
    }
  };