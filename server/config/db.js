// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURL =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-app';

    await mongoose.connect(mongoURL);

    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
