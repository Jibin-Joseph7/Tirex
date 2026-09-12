const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    accountName: { type: String, required: true },
    accountType: {
      type: String,
      enum: ['checking', 'savings', 'credit', 'investment'],
      required: true,
    },
    accountNumber: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', accountSchema);