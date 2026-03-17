// client/src/components/Footer.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiMail, FiPhone } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-gray-900 text-gray-100 mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="text-lg font-bold mb-4">GroceryMart</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your smart companion for finding the best grocery prices across different vendors.
              Save money while shopping smart.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white transition cursor-pointer">Price Comparison</li>
              <li className="hover:text-white transition cursor-pointer">Search Items</li>
              <li className="hover:text-white transition cursor-pointer">Expense Tracking</li>
              <li className="hover:text-white transition cursor-pointer">Best Deals</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2 hover:text-white transition cursor-pointer">
                <FiMail size={16} />
                <span>ankitverma24@navgurukul.org</span>
              </div>
              <div className="flex items-center gap-2 hover:text-white transition cursor-pointer">
                <FiPhone size={16} />
                <span>+91 9317081599</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-400 flex items-center gap-1">
              Made with <FiHeart size={16} className="text-red-500" /> for smart shoppers
            </p>
            <p className="text-sm text-gray-400 mt-4 md:mt-0">
              © {currentYear} GroceryMart. All rights reserved. ankitverma
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
