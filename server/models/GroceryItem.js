// server/models/GroceryItem.js
const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    inCart: {
      type: String,
      default: 'no',
    },
    prices: {
      mall: {
        price: Number,
        amount: Number,
      },
      online: {
        price: Number,
        amount: Number,
      },
      local: {
        price: Number,
        amount: Number,
      },
    },
    bestPrice: {
      source: String,
      price: Number,
      amount: Number,
    },
    lastOrderPrice: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('GroceryItem', groceryItemSchema);
