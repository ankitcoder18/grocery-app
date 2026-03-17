// client/src/components/PriceComparison.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FiTrendingDown, FiAward } from 'react-icons/fi';
import { groceryApi } from '../api/groceryApi';
import { formatCurrency, calculateTotalSavings, groupBySource } from '../utils/helpers';

const PriceComparison = () => {
  const [items, setItems] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [savings, setSavings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await groceryApi.getAllItems();
      setItems(response.data);

      // Prepare chart data
      const data = response.data
        .filter((item) => item.bestPrice)
        .slice(0, 15)
        .map((item) => ({
          name: item.name.substring(0, 10),
          Mall: item.prices?.mall?.amount || 0,
          Online: item.prices?.online?.amount || 0,
          Local: item.prices?.local?.amount || 0,
          Best: item.bestPrice?.amount || 0,
        }));

      setChartData(data);

      // Calculate savings
      const totalSavings = calculateTotalSavings(response.data);
      setSavings(totalSavings);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const SourceBreakdown = () => {
    const grouped = groupBySource(items);
    const total = items.length;

    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { source: 'Mall', data: grouped.Mall, color: 'bg-blue-100 text-blue-700', icon: '🏬' },
          { source: 'Online', data: grouped.Online, color: 'bg-purple-100 text-purple-700', icon: '🛒' },
          { source: 'Local', data: grouped.Local, color: 'bg-green-100 text-green-700', icon: '🏪' },
        ].map((item) => (
          <motion.div
            key={item.source}
            whileHover={{ y: -4 }}
            className={`card ${item.color} border-2`}
          >
            <div className="text-center">
              <p className="text-2xl mb-2">{item.icon}</p>
              <p className="font-bold text-lg">{item.data.length}</p>
              <p className="text-sm opacity-75">Best in {item.source}</p>
              <p className="text-xs mt-2 opacity-60">{((item.data.length / total) * 100).toFixed(0)}%</p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">📊</div>
          <p className="text-gray-600">Analyzing prices...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Savings Summary */}
      {savings && (
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-8 shadow-lg"
        >
          <div className="flex items-center gap-4 mb-4">
            <FiAward className="text-4xl" />
            <h2 className="text-2xl font-bold">Total Savings Available</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-green-100 text-sm mb-1">Amount Saved</p>
              <p className="text-3xl font-bold">{formatCurrency(savings.amount)}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm mb-1">Savings Percentage</p>
              <p className="text-3xl font-bold">{savings.percentage}%</p>
            </div>
            <div>
              <p className="text-green-100 text-sm mb-1">Comparison</p>
              <p className="text-sm">
                <span className="font-bold">{formatCurrency(savings.totalBestPrice)}</span> vs{' '}
                <span className="font-bold">{formatCurrency(savings.totalMallPrice)}</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Source Breakdown */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Best Price Source Distribution</h3>
        <SourceBreakdown />
      </div>

      {/* Price Comparison Chart */}
      {chartData.length > 0 && (
        <motion.div whileHover={{ y: -4 }} className="card">
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingDown className="text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Price Comparison (Top 15 Items)</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="Mall" fill="#3B82F6" />
              <Bar dataKey="Online" fill="#A855F7" />
              <Bar dataKey="Local" fill="#10B981" />
              <Bar dataKey="Best" fill="#F59E0B" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ y: -4 }} className="card">
          <h4 className="font-bold text-gray-900 mb-3">📈 Pricing Insights</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Mall offers {groupBySource(items).Mall.length} best prices
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Online offers {groupBySource(items).Online.length} best prices
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Local vendors offer {groupBySource(items).Local.length} best prices
            </li>
          </ul>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="card">
          <h4 className="font-bold text-gray-900 mb-3">💡 Recommendations</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Check local vendors for fresh produce</li>
            <li>✓ Compare bulk purchases online</li>
            <li>✓ Use mall deals for packaged items</li>
            <li>✓ Create shopping list by best price source</li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PriceComparison;
