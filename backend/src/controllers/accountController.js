const Account = require('../models/Account');
const generateAccountNumber = require('../utils/generateAccountNumber');

exports.createAccount = async (req, res) => {
  try {
    const { accountName, accountType, balance, currency } = req.body;
    const account = await Account.create({
      user: req.user._id,
      accountName,
      accountType,
      balance: balance || 0,
      currency: currency || 'INR',
      accountNumber: generateAccountNumber(),
    });
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create account', error: err.message });
  }
};

exports.getAccounts = async (req, res) => {
  const accounts = await Account.find({ user: req.user._id, isActive: true });
  res.json(accounts);
};

exports.getAccount = async (req, res) => {
  const account = await Account.findOne({ _id: req.params.id, user: req.user._id });
  if (!account) return res.status(404).json({ message: 'Account not found' });
  res.json(account);
};

exports.updateAccount = async (req, res) => {
  const account = await Account.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!account) return res.status(404).json({ message: 'Account not found' });
  res.json(account);
};

exports.deleteAccount = async (req, res) => {
  const account = await Account.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isActive: false },
    { new: true }
  );
  if (!account) return res.status(404).json({ message: 'Account not found' });
  res.json({ message: 'Account closed' });
};