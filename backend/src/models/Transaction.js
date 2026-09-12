const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    toAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, // for transfers
    type: {
      type: String,
      enum: ['income', 'expense', 'transfer', 'investment'],
      required: true,
    },
    category: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);