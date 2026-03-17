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
      online: { price: 45, amount: 20250 },
      mall: { price: 43.3, amount: 19485 },
      local: { price: 44.54, amount: 20043 },
    },
    bestPrice: { source: 'Mall', price: 43.3, amount: 19485 },
  },
  {
    name: 'Wheat flour (Atta)',
    quantity: 550,
    unit: 'KG',
    inCart: '5kg',
    prices: {
      online: { price: 179, amount: 19690 },
      mall: { price: 32.9, amount: 18095 },
      local: { price: 35, amount: 19250 },
    },
    bestPrice: { source: 'Mall', price: 32.9, amount: 18095 },
  },
  {
    name: 'Poha',
    quantity: 12,
    unit: 'KG',
    inCart: 'done',
    prices: {
      online: { price: 67, amount: 804 },
      mall: { price: 68, amount: 816 },
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
      online: { price: 60, amount: 600 },
      mall: { price: 58, amount: 580 },
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
      online: { price: 181, amount: 1086 },
      mall: { price: 0, amount: 0 },
      local: { price: 181, amount: 1086 },
    },
    bestPrice: { source: 'Online', price: 181, amount: 1086 },
  },
  {
    name: 'Rajma',
    quantity: 22,
    unit: 'KG',
    inCart: '2kg',
    prices: {
      online: { price: 134, amount: 2948 },
      mall: { price: 116, amount: 2552 },
      local: { price: 127, amount: 2794 },
    },
    bestPrice: { source: 'Mall', price: 116, amount: 2552 },
  },
  {
    name: 'Chole (Kabuli channa)',
    quantity: 12,
    unit: 'KG',
    inCart: '9kg',
    prices: {
      online: { price: 119, amount: 1428 },
      mall: { price: 112, amount: 1344 },
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
      online: { price: 173, amount: 5190 },
      mall: { price: 74, amount: 2220 },
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
      online: { price: 159, amount: 3180 },
      mall: { price: 126, amount: 2520 },
      local: { price: 130, amount: 2600 },
    },
    bestPrice: { source: 'Mall', price: 126, amount: 2520 },
  },
  {
    name: 'Sugar',
    quantity: 6,
    unit: 'KG',
    inCart: 'done',
    prices: {
      online: { price: 54, amount: 324 },
      mall: { price: 46, amount: 276 },
      local: { price: 46, amount: 276 },
    },
    bestPrice: { source: 'Mall', price: 46, amount: 276 },
  },
  {
    name: 'Masoor dal',
    quantity: 22,
    unit: 'KG',
    inCart: '',
    prices: {
      online: { price: 0, amount: 0 },
      mall: { price: 79, amount: 1738 },
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
      online: { price: 95, amount: 760 },
      mall: { price: 119, amount: 952 },
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
      online: { price: 194, amount: 1552 },
      mall: { price: 149, amount: 1192 },
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
      online: { price: 0, amount: 0 },
      mall: { price: 0, amount: 0 },
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
      online: { price: 231, amount: 1848 },
      mall: { price: 249, amount: 1992 },
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
      online: { price: 160, amount: 8800 },
      mall: { price: 152, amount: 8360 },
      local: { price: 176, amount: 9680 },
    },
    bestPrice: { source: 'Mall', price: 152, amount: 8360 },
  },
  {
    name: 'Salt',
    quantity: 30,
    unit: 'KG',
    inCart: '5kg',
    prices: {
      online: { price: 27, amount: 810 },
      mall: { price: 26.9, amount: 807 },
      local: { price: 27, amount: 810 },
    },
    bestPrice: { source: 'Mall', price: 26.9, amount: 807 },
  },
  {
    name: 'Turmeric powder',
    quantity: 3,
    unit: 'KG',
    inCart: 'done',
    prices: {
      online: { price: 250, amount: 750 },
      mall: { price: 229, amount: 687 },
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
      online: { price: 290, amount: 870 },
      mall: { price: 270, amount: 810 },
      local: { price: 255, amount: 765 },
    },
    bestPrice: { source: 'Local', price: 255, amount: 765 },
  },
  {
    name: 'Coriander powder',
    quantity: 3,
    unit: 'KG',
    inCart: 'done',
    prices: {
      online: { price: 178, amount: 534 },
      mall: { price: 318, amount: 954 },
      local: { price: 155, amount: 465 },
    },
    bestPrice: { source: 'Local', price: 155, amount: 465 },
  },
  {
    name: 'Cumin seeds',
    quantity: 3,
    unit: 'KG',
    inCart: '',
    prices: {
      online: { price: 0, amount: 0 },
      mall: { price: 329, amount: 987 },
      local: { price: 270, amount: 810 },
    },
    bestPrice: { source: 'Local', price: 270, amount: 810 },
  },
  {
    name: 'Garam masala',
    quantity: 3,
    unit: 'KG',
    inCart: '1kg',
    prices: {
      online: { price: 690, amount: 2070 },
      mall: { price: 349, amount: 1047 },
      local: { price: 450, amount: 1350 },
    },
    bestPrice: { source: 'Mall', price: 349, amount: 1047 },
  },
  {
    name: 'Ajwain',
    quantity: 1,
    unit: 'KG',
    inCart: '',
    prices: {
      online: { price: 0, amount: 0 },
      mall: { price: 338, amount: 338 },
      local: { price: 400, amount: 400 },
    },
    bestPrice: { source: 'Mall', price: 338, amount: 338 },
  },
  {
    name: 'Kitchen king',
    quantity: 35,
    unit: 'PKT',
    inCart: '7pkt',
    prices: {
      online: { price: 65, amount: 2275 },
      mall: { price: 74, amount: 2590 },
      local: { price: 80, amount: 2800 },
    },
    bestPrice: { source: 'Online', price: 65, amount: 2275 },
  },
  {
    name: 'Black chana',
    quantity: 8,
    unit: 'KG',
    inCart: 'done',
    prices: {
      online: { price: 89, amount: 712 },
      mall: { price: 74, amount: 592 },
      local: { price: 72, amount: 576 },
    },
    bestPrice: { source: 'Local', price: 72, amount: 576 },
  },
  {
    name: 'Fortune oil',
    quantity: 15,
    unit: 'L',
    inCart: '4l',
    prices: {
      online: { price: 140, amount: 2100 },
      mall: { price: 129, amount: 1935 },
      local: { price: 135, amount: 2025 },
    },
    bestPrice: { source: 'Mall', price: 129, amount: 1935 },
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
    
    const totalExpense = groceryData.reduce(
      (sum, item) => sum + (item.bestPrice?.amount || 0),
      0
    );

    const expenseRecord = new Expense({
      date: currentDate,
      month,
      items: groceryData.map((item) => ({
        name: item.name,
        amount: item.bestPrice?.amount || 0,
        source: item.bestPrice?.source || 'N/A',
      })),
      totalExpense,
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
