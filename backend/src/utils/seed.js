require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const generateAccountNumber = require('./generateAccountNumber');

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany(), Account.deleteMany(), Transaction.deleteMany(), Budget.deleteMany(),
  ]);

  const admin = await User.create({ name: 'Admin', email: 'admin@tirex.dev', password: 'password123', role: 'admin' });
  const customer = await User.create({ name: 'Jibin Joseph', email: 'jibin@tirex.dev', password: 'password123', role: 'customer' });

  const checking = await Account.create({
    user: customer._id, accountName: 'Primary Checking', accountType: 'checking',
    accountNumber: generateAccountNumber(), balance: 50000,
  });
  const savings = await Account.create({
    user: customer._id, accountName: 'Savings', accountType: 'savings',
    accountNumber: generateAccountNumber(), balance: 120000,
  });

  await Transaction.create([
    { user: customer._id, account: checking._id, type: 'income', category: 'Salary', amount: 60000, description: 'Monthly salary' },
    { user: customer._id, account: checking._id, type: 'expense', category: 'Groceries', amount: 4500, description: 'Supermarket' },
    { user: customer._id, account: checking._id, type: 'expense', category: 'Rent', amount: 15000, description: 'Monthly rent' },
  ]);

  await Budget.create({
    user: customer._id, category: 'Groceries', limit: 8000,
    month: new Date().getMonth() + 1, year: new Date().getFullYear(),
  });

  console.log('Seed complete:', { admin: admin.email, customer: customer.email });
  await mongoose.disconnect();
};

seed().catch((err) => { console.error(err); process.exit(1); });