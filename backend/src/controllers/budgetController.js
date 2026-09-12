const Budget = require('../models/Budget');

exports.createBudget = async (req, res) => {
  try {
    const { category, limit, month, year } = req.body;
    const budget = await Budget.create({
      user: req.user._id,
      category,
      limit,
      month: month || new Date().getMonth() + 1,
      year: year || new Date().getFullYear(),
    });
    res.status(201).json(budget);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Budget for this category and month already exists' });
    }
    res.status(500).json({ message: 'Failed to create budget', error: err.message });
  }
};

exports.getBudgets = async (req, res) => {
  const { month, year } = req.query;
  const filter = { user: req.user._id };
  if (month) filter.month = Number(month);
  if (year) filter.year = Number(year);

  const budgets = await Budget.find(filter);
  const withStatus = budgets.map((b) => ({
    ...b.toObject(),
    percentUsed: b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0,
    overspent: b.spent > b.limit,
  }));
  res.json(withStatus);
};

exports.updateBudget = async (req, res) => {
  const budget = await Budget.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!budget) return res.status(404).json({ message: 'Budget not found' });
  res.json(budget);
};

exports.deleteBudget = async (req, res) => {
  const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!budget) return res.status(404).json({ message: 'Budget not found' });
  res.json({ message: 'Budget deleted' });
};