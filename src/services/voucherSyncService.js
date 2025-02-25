import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
import VoucherCode from '../models/VoucherCode.js';

// Load environment variables
dotenv.config();

const API_URL = process.env.API_URL;
const BASIC_AUTH = {
  username: process.env.API_USERNAME,
  password: process.env.API_PASSWORD,
};

// Function to fetch voucher info from external API
const fetchVoucherStatus = async (voucherCode) => {
  console.log(`🔍 [CHECK] Fetching data for voucher ${voucherCode}...`);
  
  try {
    const response = await axios.get(`${API_URL}/${voucherCode}?domain=default`, {
      auth: BASIC_AUTH,
    });

    console.log(`📡 [API RESPONSE] Voucher ${voucherCode}:`, JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error(`❌ [API ERROR] Fetching voucher ${voucherCode}:`, error.message);
    return null;
  }
};

// Function to update voucher in MongoDB if needed
const updateVoucherIfChanged = async (dbVoucher, apiVoucher) => {
  const updatedFields = {};

  if (dbVoucher.status !== apiVoucher.status) updatedFields.status = apiVoucher.status;
  if (dbVoucher.remainingValue !== apiVoucher.remainingValue) updatedFields.remainingValue = apiVoucher.remainingValue;
  if (dbVoucher.endDate !== apiVoucher.endDate) updatedFields.endDate = apiVoucher.endDate;

  if (Object.keys(updatedFields).length > 0) {
    await VoucherCode.findByIdAndUpdate(dbVoucher._id, updatedFields);
    console.log(`✅ [UPDATED] Voucher ${dbVoucher.custMvtCode}:`, updatedFields);
    return true;
  } else {
    console.log(`⚠️ [NO CHANGE] Voucher ${dbVoucher.custMvtCode} remains the same.`);
  }

  return false;
};

// Function to check and update all emitted vouchers
const syncVouchers = async () => {
  console.log('🔄 [CRON] Voucher sync started...');

  let updatedCount = 0;

  try {
    const emittedVouchers = await VoucherCode.find({ status: 'E' });

    if (emittedVouchers.length === 0) {
      console.log('ℹ️ [CRON] No emitted vouchers found.');
    }

    for (const voucher of emittedVouchers) {
      console.log(`🟡 [PROCESSING] Checking voucher ${voucher.custMvtCode}...`);
      const apiVoucher = await fetchVoucherStatus(voucher.custMvtCode);
      
      if (apiVoucher) {
        const wasUpdated = await updateVoucherIfChanged(voucher, apiVoucher);
        if (wasUpdated) updatedCount++;
      }
    }

    console.log(`✅ [CRON] Voucher sync finished. Updated ${updatedCount} voucher(s).`);
  } catch (error) {
    console.error('❌ [CRON] Error in voucher sync job:', error.message);
  }
};

// Schedule the job to run every 10 minutes
cron.schedule('*/1 * * * *', syncVouchers);

export default syncVouchers;
