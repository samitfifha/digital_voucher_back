
import Voucher from '../models/Voucher.js';
import { getAllVouchers, getVouchersByVoucherId } from '../services/voucherCodeService.js';


export const getVouchers = async (req, res) => {
    try {
      const vouchers = await getAllVouchers();
      res.status(200).json(vouchers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching vouchers', error });
    }
  };
  
  export const getVouchersById = async (req, res) => {
    try {
      const { voucherId } = req.params;
      const vouchers = await getVouchersByVoucherId(voucherId);
  
      if (!vouchers || vouchers.length === 0) {
        return res.status(404).json({ message: 'No vouchers found for this voucherId' });
      }
  
      res.status(200).json(vouchers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching vouchers', error });
    }
  }; 