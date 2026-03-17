// server/models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    items: [
      {
        name: String,
        amount: Number,
        source: String,
      },
    ],
    totalExpense: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
