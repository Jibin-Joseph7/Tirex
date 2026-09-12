const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Investment = require('../models/Investment');

exports.getSummary = async (req, res) => {
  const userId = req.user._id;

  const accounts = await Account.find({ user: userId, isActive: true });
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyTx = await Transaction.find({ user: userId, date: { $gte: startOfMonth } });
  const income = monthlyTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = monthlyTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  const investments = await Investment.find({ user: userId });
  const investmentValue = investments.reduce((s, i) => s + i.currentValue, 0);

  const netWorth = totalBalance + investmentValue;

  res.json({
    totalBalance,
    monthlyIncome: income,
    monthlyExpenses: expenses,
    savingsRate,
    investmentValue,
    netWorth,
    accountCount: accounts.length,
  });
};

exports.getSpendingByCategory = async (req, res) => {
  const { month, year } = req.query;
  const now = new Date();
  const m = month ? Number(month) - 1 : now.getMonth();
  const y = year ? Number(year) : now.getFullYear();
  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 1);

  const result = await Transaction.aggregate([
    { $match: { user: req.user._id, type: 'expense', date: { $gte: start, $lt: end } } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } },
  ]);

  res.json(result.map((r) => ({ category: r._id, total: r.total })));
};

exports.getMonthlyTrend = async (req, res) => {
  const result = await Transaction.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
  res.json(result);
};