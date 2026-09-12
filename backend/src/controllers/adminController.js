const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

exports.listUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.deactivateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.platformStats = async (req, res) => {
  const userCount = await User.countDocuments();
  const accountCount = await Account.countDocuments();
  const transactionCount = await Transaction.countDocuments();
  res.json({ userCount, accountCount, transactionCount });
};