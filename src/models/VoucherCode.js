import mongoose from 'mongoose';

const voucherCodeSchema = new mongoose.Schema({
  voucherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher', required: true },
  custMvtCode: { type: String, required: true, unique: true },
  custMvtType: { type: String, default: '8' },
  status: { type: String, enum: ['E', 'U'], default: 'E' }, // E = Emitted, U = Used
  transactionIssue: {
    storeId: { type: String, required: true },
    posId: { type: String, required: true },
  },
  dateIssue: { type: Date, default: Date.now },
  amountType: {
    currency: { type: String, default: 'TND' },
    value: { type: Number, required: true },
  },
  usedAmountType: {
    currency: { type: String, default: 'TND' },
    value: { type: Number, default: 0 },
  },
}, { timestamps: true });

export default mongoose.model('VoucherCode', voucherCodeSchema);
