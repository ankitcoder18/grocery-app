// server/models/ShoppingSession.js
const mongoose = require('mongoose');

const vendorPriceSchema = new mongoose.Schema({
  vendorName: { type: String, required: true }, // e.g. "Mall", "Online", "Local", or custom
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
});

const sessionItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true, default: 'KG' },
  vendorPrices: [vendorPriceSchema],
  bestVendor: {
    name: String,
    pricePerUnit: Number,
    totalAmount: Number,
  },
});

const shoppingSessionSchema = new mongoose.Schema(
  {
    sessionName: { type: String, required: true }, // e.g. "March 2026"
    status: { type: String, enum: ['draft', 'completed'], default: 'draft' },
    items: [sessionItemSchema],
    totalBestPrice: { type: Number, default: 0 },
    totalMaxPrice: { type: Number, default: 0 },
    totalSavings: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShoppingSession', shoppingSessionSchema);
