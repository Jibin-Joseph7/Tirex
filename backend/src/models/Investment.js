const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['stock', 'mutual_fund', 'fd', 'crypto', 'gold'],
      required: true,
    },
    name: { type: String, required: true },
    units: { type: Number, default: 1 },
    purchasePrice: { type: Number, required: true },
    currentValue: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
    maturityDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

investmentSchema.virtual('gainLoss').get(function () {
  return this.currentValue - this.purchasePrice * this.units;
});

investmentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Investment', investmentSchema);