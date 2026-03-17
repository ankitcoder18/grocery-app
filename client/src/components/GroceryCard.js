// client/src/components/GroceryCard.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiInfo } from 'react-icons/fi';
import { formatCurrency, getSourceIcon, findBestPrice } from '../utils/helpers';

const GroceryCard = ({ item, index }) => {
  const bestPrice = findBestPrice(item);

  const getPriceVariant = () => {
    if (item.prices?.mall?.price && bestPrice?.source === 'Mall') return 'bg-blue-50 border-blue-200';
    if (item.prices?.online?.price && bestPrice?.source === 'Online')
      return 'bg-purple-50 border-purple-200';
    if (item.prices?.local?.price && bestPrice?.source === 'Local') return 'bg-green-50 border-green-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={`card border-2 ${getPriceVariant()}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-500">
            {item.quantity} {item.unit}
          </p>
        </div>
        {bestPrice && (
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-green-300">
            <FiCheckCircle className="text-green-600" />
            <span className="text-sm font-semibold text-green-700">Best</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {/* Price Options */}
        <div className="grid grid-cols-3 gap-2">
          {item.prices?.mall?.price && (
            <div
              className={`p-3 rounded-lg ${
                bestPrice?.source === 'Mall' ? 'ring-2 ring-blue-400 bg-blue-100' : 'bg-gray-100'
              }`}
            >
              <p className="text-xs text-gray-600 mb-1">🏬 Mall</p>
              <p className="text-sm font-bold text-gray-800">{formatCurrency(item.prices.mall.price)}</p>
              <p className="text-xs text-gray-500">{formatCurrency(item.prices.mall.amount)}</p>
            </div>
          )}
          {item.prices?.online?.price && (
            <div
              className={`p-3 rounded-lg ${
                bestPrice?.source === 'Online' ? 'ring-2 ring-purple-400 bg-purple-100' : 'bg-gray-100'
              }`}
            >
              <p className="text-xs text-gray-600 mb-1">🛒 Online</p>
              <p className="text-sm font-bold text-gray-800">{formatCurrency(item.prices.online.price)}</p>
              <p className="text-xs text-gray-500">{formatCurrency(item.prices.online.amount)}</p>
            </div>
          )}
          {item.prices?.local?.price && (
            <div
              className={`p-3 rounded-lg ${
                bestPrice?.source === 'Local' ? 'ring-2 ring-green-400 bg-green-100' : 'bg-gray-100'
              }`}
            >
              <p className="text-xs text-gray-600 mb-1">🏪 Local</p>
              <p className="text-sm font-bold text-gray-800">{formatCurrency(item.prices.local.price)}</p>
              <p className="text-xs text-gray-500">{formatCurrency(item.prices.local.amount)}</p>
            </div>
          )}
        </div>

        {/* Best Price Highlight */}
        {bestPrice && (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg flex items-center justify-between"
          >
            <div>
              <p className="text-xs opacity-90">Cheapest Option</p>
              <p className="text-lg font-bold">{formatCurrency(bestPrice.amount)}</p>
            </div>
            <span className="text-2xl">{getSourceIcon(bestPrice.source)}</span>
          </motion.div>
        )}

        {/* Status Badge */}
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
          <FiInfo size={14} />
          <span>{item.inCart || 'Not in cart'}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default GroceryCard;
