import ExcelJS from 'exceljs';
import fs from 'fs';

// Function to generate Excel file
export const generateVoucherExcelFile = async (vouchers) => {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Vouchers');

  // Define columns
  worksheet.columns = [
    { header: 'GS1Code', key: 'GS1Code', width: 20 },
    { header: 'Value', key: 'Value', width: 15 },
    { header: 'DateOfGeneration', key: 'DateOfGeneration', width: 20 },
    { header: 'ExpireDate', key: 'ExpireDate', width: 20 }
  ];

  // Add rows
  vouchers.forEach(voucher => {
    worksheet.addRow({
      GS1Code: voucher.custMvtCode,
      Value: voucher.amountType.value,
      DateOfGeneration: voucher.dateIssue,
      ExpireDate: new Date(new Date(voucher.dateIssue).setFullYear(new Date(voucher.dateIssue).getFullYear() + 1))
        .toISOString().split('T')[0]
    });
  });

  // Generate timestamp with milliseconds
  const now = new Date();
  const timestamp = now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0') +
    String(now.getMilliseconds()).padStart(3, '0');

  // Create the file name
  const fileName = `${timestamp}_Vouchers.xlsx`;

  // Save the workbook to file
  await workbook.xlsx.writeFile(fileName);
  return fileName;
};
