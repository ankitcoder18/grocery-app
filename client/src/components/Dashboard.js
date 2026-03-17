// client/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { FiTrendingUp, FiDollarSign, FiShoppingCart, FiBarChart2 } from 'react-icons/fi';
import { groceryApi, expenseApi } from '../api/groceryApi';
import { formatCurrency, groupBySource } from '../utils/helpers';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalExpense: 0,
    averagePrice: 0,
    sourceDistribution: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const itemsResponse = await groceryApi.getAllItems();
      const expensesResponse = await expenseApi.getMonthlySummary();

      setItems(itemsResponse.data);
      setExpenses(expensesResponse.data);

      // Calculate statistics
      calculateStats(itemsResponse.data, expensesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (itemsData, expensesData) => {
    const grouped = groupBySource(itemsData);

    const sourceDistribution = [
      {
        name: 'Mall',
        value: grouped.Mall.length,
        color: '#3B82F6',
      },
      {
        name: 'Online',
        value: grouped.Online.length,
        color: '#A855F7',
      },
      {
        name: 'Local',
        value: grouped.Local.length,
        color: '#10B981',
      },
    ].filter((item) => item.value > 0);

    const totalExpense = expensesData.reduce((sum, month) => sum + month.totalExpense, 0);
    const averagePrice =
      itemsData.length > 0
        ? itemsData.reduce((sum, item) => sum + (item.bestPrice?.price || 0), 0) / itemsData.length
        : 0;

    setStats({
      totalItems: itemsData.length,
      totalExpense,
      averagePrice: averagePrice.toFixed(2),
      sourceDistribution,
      monthlyData: expensesData.slice(0, 6),
    });
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className={`card border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <Icon className="text-4xl opacity-30" />
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-gray-600">Loading dashboard...</p>
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FiShoppingCart}
          label="Total Items"
          value={stats.totalItems}
          color="border-green-500"
        />
        <StatCard
          icon={FiDollarSign}
          label="Total Expense"
          value={formatCurrency(stats.totalExpense)}
          color="border-blue-500"
        />
        <StatCard
          icon={FiTrendingUp}
          label="Avg Price"
          value={formatCurrency(stats.averagePrice)}
          color="border-purple-500"
        />
        <StatCard
          icon={FiBarChart2}
          label="Best Source"
          value={stats.sourceDistribution[0]?.name || 'N/A'}
          color="border-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Distribution Pie Chart */}
        {stats.sourceDistribution.length > 0 && (
          <motion.div
            whileHover={{ y: -4 }}
            className="card"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Price Source Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.sourceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.sourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Monthly Expense Chart */}
        {stats.monthlyData && stats.monthlyData.length > 0 && (
          <motion.div
            whileHover={{ y: -4 }}
            className="card"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="totalExpense"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
