const Investment = require('../models/Investment');

exports.createInvestment = async (req, res) => {
  try {
    const investment = await Investment.create({ ...req.body, user: req.user._id });
    res.status(201).json(investment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add investment', error: err.message });
  }
};

exports.getInvestments = async (req, res) => {
  const investments = await Investment.find({ user: req.user._id });
  const totalInvested = investments.reduce((sum, i) => sum + i.purchasePrice * i.units, 0);
  const totalCurrent = investments.reduce((sum, i) => sum + i.currentValue, 0);
  res.json({ investments, totalInvested, totalCurrent, totalGainLoss: totalCurrent - totalInvested });
};

exports.updateInvestment = async (req, res) => {
  const investment = await Investment.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!investment) return res.status(404).json({ message: 'Investment not found' });
  res.json(investment);
};

exports.deleteInvestment = async (req, res) => {
  const investment = await Investment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!investment) return res.status(404).json({ message: 'Investment not found' });
  res.json({ message: 'Investment removed' });
};