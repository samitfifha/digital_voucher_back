import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  description: { type: String },
  amounts: [ 
    {
      value: { type: Number, required: true },
      count: { type: Number, required: true },
    },
  ],
  generatedFiles: {
    xmlFile: String,
    excelFile: String,
    pdfFile: String,
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true },
);
export default mongoose.model('Voucher', voucherSchema);