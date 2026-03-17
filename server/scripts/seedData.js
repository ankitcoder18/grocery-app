// server/scripts/seedData.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const GroceryItem = require('../models/GroceryItem');
const Expense = require('../models/Expense');

dotenv.config();

const groceryData = [
  {
    name: 'Rice',
    quantity: 450,
    unit: 'KG',
    inCart: '5kg',
    prices: {
      mall: { price: 45, amount: 20250 },
      online: { price: 43.3, amount: 19485 },
      local: { price: 44.54, amount: 20043 },
    },
    bestPrice: { source: 'Online', price: 43.3, amount: 19485 },
  },
  {
    name: 'Wheat flour (Atta)',
    quantity: 550,
    unit: 'KG',
    inCart: '5kg',
    prices: {
      mall: { price: 179, amount: 19690 },
      online: { price: 32.9, amount: 18095 },
      local: { price: 35, amount: 19250 },
    },
    bestPrice: { source: 'Online', price: 32.9, amount: 18095 },
  },
  {
    name: 'Poha',
    quantity: 12,
    unit: 'KG',
    inCart: 'done',
    prices: {
      mall: { price: 68, amount: 816 },
      online: { price: 67, amount: 804 },
      local: { price: 76, amount: 912 },
    },
    bestPrice: { source: 'Online', price: 67, amount: 804 },
  },
  {
    name: 'Sooji',
    quantity: 10,
    unit: 'KG',
    inCart: '2kg',
    prices: {
      mall: { price: 60, amount: 600 },
      online: { price: 58, amount: 580 },
      local: { price: 54, amount: 540 },
    },
    bestPrice: { source: 'Local', price: 54, amount: 540 },
  },
  {
    name: 'Namkeen',
    quantity: 6,
    unit: 'KG',
    inCart: 'done',
    prices: {
      mall: { price: 0, amount: 0 },
      online: { price: 0, amount: 0 },
      local: { price: 181, amount: 1086 },
    },
    bestPrice: { source: 'Local', price: 181, amount: 1086 },
  },
  {
    name: 'Rajma',
    quantity: 22,
    unit: 'KG',
    inCart: '2kg',
    prices: {
      mall: { price: 134, amount: 2948 },
      online: { price: 116, amount: 2552 },
      local: { price: 127, amount: 2794 },
    },
    bestPrice: { source: 'Online', price: 116, amount: 2552 },
  },
  {
    name: 'Chole (Kabuli channa)',
    quantity: 12,
    unit: 'KG',
    inCart: '9kg',
    prices: {
      mall: { price: 119, amount: 1428 },
      online: { price: 112, amount: 1344 },
      local: { price: 103, amount: 1236 },
    },
    bestPrice: { source: 'Local', price: 103, amount: 1236 },
  },
  {
    name: 'Channa dal',
    quantity: 30,
    unit: 'KG',
    inCart: '8kg',
    prices: {
      mall: { price: 173, amount: 5190 },
      online: { price: 74, amount: 2220 },
      local: { price: 72, amount: 2160 },
    },
    bestPrice: { source: 'Local', price: 72, amount: 2160 },
  },
  {
    name: 'Arhar (Toor) dal',
    quantity: 20,
    unit: 'KG',
    inCart: '10kg',
    prices: {
      mall: { price: 159, amount: 3180 },
      online: { price: 126, amount: 2520 },
      local: { price: 130, amount: 2600 },
    },
    bestPrice: { source: 'Online', price: 126, amount: 2520 },
  },
  {
    name: 'Sugar',
    quantity: 6,
    unit: 'KG',
    inCart: 'done',
    prices: {
      mall: { price: 54, amount: 324 },
      online: { price: 46, amount: 276 },
      local: { price: 46, amount: 276 },
    },
    bestPrice: { source: 'Online', price: 46, amount: 276 },
  },
  {
    name: 'Masoor dal',
    quantity: 22,
    unit: 'KG',
    inCart: '',
    prices: {
      mall: { price: 0, amount: 0 },
      online: { price: 79, amount: 1738 },
      local: { price: 77, amount: 1694 },
    },
    bestPrice: { source: 'Local', price: 77, amount: 1694 },
  },
  {
    name: 'Soya chunks',
    quantity: 8,
    unit: 'KG',
    inCart: '1kg',
    prices: {
      mall: { price: 95, amount: 760 },
      online: { price: 119, amount: 952 },
      local: { price: 80, amount: 640 },
    },
    bestPrice: { source: 'Local', price: 80, amount: 640 },
  },
  {
    name: 'Peanuts (raw)',
    quantity: 8,
    unit: 'KG',
    inCart: '1.5kg',
    prices: {
      mall: { price: 194, amount: 1552 },
      online: { price: 149, amount: 1192 },
      local: { price: 138, amount: 1104 },
    },
    bestPrice: { source: 'Local', price: 138, amount: 1104 },
  },
  {
    name: 'Puffed rice',
    quantity: 8,
    unit: 'KG',
    inCart: '',
    prices: {
      mall: { price: 0, amount: 0 },
      online: { price: 0, amount: 0 },
      local: { price: 120, amount: 960 },
    },
    bestPrice: { source: 'Local', price: 120, amount: 960 },
  },
  {
    name: 'Peanut butter',
    quantity: 8,
    unit: 'KG',
    inCart: '4kg',
    prices: {
      mall: { price: 231, amount: 1848 },
      online: { price: 249, amount: 1992 },
      local: { price: 138, amount: 1104 },
    },
    bestPrice: { source: 'Local', price: 138, amount: 1104 },
  },
  {
    name: 'Cooking oil (mustard)',
    quantity: 55,
    unit: 'L',
    inCart: '2l',
    prices: {
      mall: { price: 160, amount: 8800 },
      online: { price: 152, amount: 8360 },
      local: { price: 176, amount: 9680 },
    },
    bestPrice: { source: 'Online', price: 152, amount: 8360 },
  },
  {
    name: 'Salt',
    quantity: 30,
    unit: 'KG',
    inCart: '5kg',
    prices: {
      mall: { price: 27, amount: 810 },
      online: { price: 26.9, amount: 807 },
      local: { price: 27, amount: 810 },
    },
    bestPrice: { source: 'Online', price: 26.9, amount: 807 },
  },
  {
    name: 'Turmeric powder',
    quantity: 3,
    unit: 'KG',
    inCart: 'done',
    prices: {
      mall: { price: 250, amount: 750 },
      online: { price: 229, amount: 687 },
      local: { price: 228, amount: 684 },
    },
    bestPrice: { source: 'Local', price: 228, amount: 684 },
  },
  {
    name: 'Red chilli powder',
    quantity: 3,
    unit: 'KG',
    inCart: 'done',
    prices: {
      mall: { price: 290, amount: 870 },
      online: { price: 270, amount: 810 },
      local: { price: 255, amount: 765 },
    },
    bestPrice: { source: 'Local', price: 255, amount: 765 },
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-app');
    console.log('Connected to MongoDB');

    // Clear existing data
    await GroceryItem.deleteMany({});
    await Expense.deleteMany({});
    console.log('Cleared existing data');

    // Insert grocery data
    await GroceryItem.insertMany(groceryData);
    console.log(`Inserted ${groceryData.length} grocery items`);

    // Create sample expense record
    const currentDate = new Date();
    const month = currentDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
    
    const expenseRecord = new Expense({
      date: currentDate,
      month,
      items: groceryData.map((item) => ({
        name: item.name,
        amount: item.bestPrice?.amount || 0,
        source: item.bestPrice?.source || 'N/A',
      })),
      totalExpense: 72496, // From your data
    });

    await expenseRecord.save();
    console.log('Created expense record');

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
