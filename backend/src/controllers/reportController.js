const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const Transaction = require('../models/Transaction');

const getFilteredTransactions = async (userId, from, to) => {
  const filter = { user: userId };
  if (from || to) filter.date = {};
  if (from) filter.date.$gte = new Date(from);
  if (to) filter.date.$lte = new Date(to);
  return Transaction.find(filter).populate('account', 'accountName').sort({ date: -1 });
};

exports.exportPDF = async (req, res) => {
  const { from, to } = req.query;
  const transactions = await getFilteredTransactions(req.user._id, from, to);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=tirex-report.pdf');

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);

  doc.fontSize(18).text('Tirex — Transaction Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10);

  transactions.forEach((t) => {
    doc.text(
      `${t.date.toISOString().slice(0, 10)}  |  ${t.type.padEnd(10)}  |  ${t.category.padEnd(15)}  |  ${t.amount}`
    );
  });

  doc.end();
};

exports.exportExcel = async (req, res) => {
  const { from, to } = req.query;
  const transactions = await getFilteredTransactions(req.user._id, from, to);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Transactions');

  sheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Type', key: 'type', width: 12 },
    { header: 'Category', key: 'category', width: 18 },
    { header: 'Amount', key: 'amount', width: 12 },
    { header: 'Description', key: 'description', width: 30 },
  ];

  transactions.forEach((t) => {
    sheet.addRow({
      date: t.date.toISOString().slice(0, 10),
      type: t.type,
      category: t.category,
      amount: t.amount,
      description: t.description || '',
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=tirex-report.xlsx');

  await workbook.xlsx.write(res);
  res.end();
};