const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const Budget = require('../models/Budget');
const Notification = require('../models/Notification');

const applyBalanceChange = async (account, type, amount) => {
  if (type === 'income') account.balance += amount;
  if (type === 'expense' || type === 'investment') account.balance -= amount;
  await account.save();
};

const checkBudgetOverspend = async (userId, category, amount) => {
  const now = new Date();
  const budget = await Budget.findOne({
    user: userId,
    category,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });
  if (!budget) return;

  budget.spent += amount;
  await budget.save();

  if (budget.spent > budget.limit) {
    await Notification.create({
      user: userId,
      type: 'budget_limit',
      message: `You have exceeded your ${category} budget for this month.`,
    });
  }
};

exports.createTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { account: accountId, toAccount, type, category, amount, description, date } = req.body;

    const account = await Account.findOne({ _id: accountId, user: req.user._id }).session(session);
    if (!account) throw new Error('Source account not found');

    if (type === 'expense' && account.balance < amount) {
      throw new Error('Insufficient balance');
    }

    const [transaction] = await Transaction.create(
      [{ user: req.user._id, account: accountId, toAccount, type, category, amount, description, date }],
      { session }
    );

    await applyBalanceChange(account, type, amount);

    if (type === 'transfer' && toAccount) {
      const destination = await Account.findById(toAccount).session(session);
      if (destination) {
        destination.balance += amount;
        await destination.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    if (type === 'expense') {
      await checkBudgetOverspend(req.user._id, category, amount);
    }

    res.status(201).json(transaction);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  const { account, type, category, from, to, page = 1, limit = 20 } = req.query;
  const filter = { user: req.user._id };
  if (account) filter.account = account;
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (from || to) filter.date = {};
  if (from) filter.date.$gte = new Date(from);
  if (to) filter.date.$lte = new Date(to);

  const transactions = await Transaction.find(filter)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Transaction.countDocuments(filter);
  res.json({ transactions, total, page: Number(page) });
};

exports.deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
  res.json({ message: 'Transaction deleted' });
};