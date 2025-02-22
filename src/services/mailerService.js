// mailerService.js
import nodemailer from 'nodemailer';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Configure the email transporter (e.g., Gmail, Outlook, etc.)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true pour 465, false pour les autres ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false // Essai pour éviter des problèmes de certificat auto-signé
    }
  });
  

/**
 * Send an email with attachments
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body
 * @param {Array<{ filename: string, path: string }>} attachments - Array of file attachments
 */
export const sendEmailWithAttachments = async (to, cc, subject, text, attachments) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to, // Recipient (User)
        cc, // Admin in CC
        subject,
        text,
        attachments,
      };
  
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  };
  