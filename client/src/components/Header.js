// client/src/components/Header.js
import React from 'react';
import { FiShoppingCart, FiTrendingDown } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiShoppingCart className="text-3xl" />
            <div>
              <h1 className="text-3xl font-bold">GroceryMart</h1>
              <p className="text-green-100">Smart Price Comparison</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg">
            <FiTrendingDown />
            <span className="text-sm font-medium">Save More, Spend Less</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
