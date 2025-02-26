import puppeteer from 'puppeteer';
import fs from 'fs';
import handlebars from 'handlebars';
import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';

// Load the HTML template
const templateSource = fs.readFileSync('src/assets/voucher_template.html', 'utf8');
const template = handlebars.compile(templateSource);

// Function to generate a barcode image as a data URL
const generateBarcode = (code) => {
    const canvas = createCanvas(200, 100); // Adjust size as needed
    JsBarcode(canvas, code, {
      format: 'EAN13', // Barcode format
      displayValue: true, // Show the barcode value below the barcode
      fontSize: 14, // Font size for the barcode value
      width: 2, // Bar width
      height: 50, // Bar height
    });
    return canvas.toDataURL(); // Return the barcode as a data URL
  };

// Function to generate the PDF
const generatePdf = async (vouchers, outputPath) => {
  // Add barcode images and expiry dates to vouchers
  const vouchersWithBarcodes = vouchers.map((voucher) => ({
    ...voucher,
    barcodeImage: generateBarcode(voucher.custMvtCode),
    expiryDate: new Date(new Date(voucher.dateIssue).setFullYear(new Date(voucher.dateIssue).getFullYear() + 1))
    .toISOString().split('T')[0], // Example expiry date
  }));

  // Generate HTML with dynamic data
  const html = template({ vouchers: vouchersWithBarcodes });

  // Launch Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Debugging: Log console messages
  page.on('console', (msg) => console.log('Puppeteer log:', msg.text()));

  // Set the HTML content
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Debugging: Take a screenshot to verify rendering
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });

  // Generate PDF
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '1mm',
      bottom: '1mm',
      left: '1mm',
      right: '1mm',
    },
  });

  // Close the browser
  await browser.close();
};

export { generatePdf };