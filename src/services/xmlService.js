// xmlService.js
import fs from 'fs';
import xmlbuilder from 'xmlbuilder';

// Function to calculate GS1 check digit
function calculateGS1CheckDigit(code12) {
  let sum = 0;
  for (let i = 0; i < code12.length; i++) {
    const num = parseInt(code12[i], 10);
    sum += (i % 2 === 0) ? num : num * 3;
  }
  return ((10 - (sum % 10)) % 10).toString();
}

// Function to generate vouchers
export function generateVouchers(amounts) { // Export this function
  const prefix = '58';
  const storeId = '1999';
  const posId = '1';

  let vouchers = [];

  amounts.forEach(amount => {
    for (let i = 0; i < amount.count; i++) {
      let uniquePart = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
      let code12 = prefix + uniquePart;
      let checkDigit = calculateGS1CheckDigit(code12);
      let custMvtCode = code12 + checkDigit;

      vouchers.push({
        custMvtCode: custMvtCode,
        custMvtType: '8',
        status: 'E',
        transactionIssue: {
          storeId: storeId,
          posId: posId
        },
        dateIssue: new Date().toISOString().split('T')[0],
        amountType: {
          currency: 'TND',
          value: amount.value.toFixed(2)
        },
        usedAmountType: {
          currency: 'TND',
          value: '0.00'
        }
      });
    }
  });

  return vouchers;
}

// Function to generate XML and save to file
export const generateVoucherXmlFile = (amounts) => {
  // Generate vouchers
  const vouchers = generateVouchers(amounts);

  // Create XML structure
  const xml = xmlbuilder.create('customerMvtListType', { version: '1.0', encoding: 'UTF-8' });
  vouchers.forEach(voucher => {
    xml.ele('values')
      .ele('custMvtCode', voucher.custMvtCode).up()
      .ele('custMvtType', voucher.custMvtType).up()
      .ele('status', voucher.status).up()
      .ele('transactionIssue')
        .ele('storeId', voucher.transactionIssue.storeId).up()
        .ele('posId', voucher.transactionIssue.posId).up()
      .up()
      .ele('dateIssue', voucher.dateIssue).up()
      .ele('amountType')
        .ele('currency', voucher.amountType.currency).up()
        .ele('value', voucher.amountType.value).up()
      .up()
      .ele('usedAmountType')
        .ele('currency', voucher.usedAmountType.currency).up()
        .ele('value', voucher.usedAmountType.value).up()
      .up();
  });

  // Convert to XML string
  const xmlString = xml.end({ pretty: true });

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
  const fileName = `${timestamp}_CustomerMvt.xml`;

  // Save XML to the file
  fs.writeFileSync(fileName, xmlString);
  return fileName;
};