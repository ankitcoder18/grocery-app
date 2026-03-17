// client/src/utils/helpers.js

export const findBestPrice = (item) => {
  const prices = [
    {
      source: 'Mall',
      price: item.prices?.mall?.price,
      amount: item.prices?.mall?.amount,
    },
    {
      source: 'Online',
      price: item.prices?.online?.price,
      amount: item.prices?.online?.amount,
    },
    {
      source: 'Local',
      price: item.prices?.local?.price,
      amount: item.prices?.local?.amount,
    },
  ];

  const validPrices = prices.filter((p) => p.price && p.amount);
  if (validPrices.length === 0) return null;

  return validPrices.reduce((best, current) =>
    current.price < best.price ? current : best
  );
};

export const calculateSavings = (best, other) => {
  if (!best || !other) return 0;
  const savings = other.price - best.price;
  const percentage = ((savings / other.price) * 100).toFixed(1);
  return { amount: savings.toFixed(2), percentage };
};

export const formatCurrency = (value) => {
  if (!value) return '₹0';
  return `₹${value.toLocaleString('en-IN')}`;
};

export const getSourceColor = (source) => {
  const colors = {
    Mall: 'bg-blue-100 text-blue-800',
    Online: 'bg-purple-100 text-purple-800',
    Local: 'bg-green-100 text-green-800',
  };
  return colors[source] || 'bg-gray-100 text-gray-800';
};

export const getSourceIcon = (source) => {
  const icons = {
    Mall: '🏬',
    Online: '🛒',
    Local: '🏪',
  };
  return icons[source] || '📦';
};

export const getCurrentMonth = () => {
  const now = new Date();
  return now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
};

export const groupBySource = (items) => {
  const grouped = {
    Mall: [],
    Online: [],
    Local: [],
  };

  items.forEach((item) => {
    if (item.bestPrice?.source) {
      grouped[item.bestPrice.source]?.push(item);
    }
  });

  return grouped;
};

export const calculateTotalSavings = (items) => {
  let totalMallPrice = 0;
  let totalBestPrice = 0;

  items.forEach((item) => {
    const mallPrice = item.prices?.mall?.amount || 0;
    const bestPrice = item.bestPrice?.amount || 0;
    totalMallPrice += mallPrice;
    totalBestPrice += bestPrice;
  });

  const savings = totalMallPrice - totalBestPrice;
  const percentage = totalMallPrice > 0 ? ((savings / totalMallPrice) * 100).toFixed(1) : 0;

  return {
    amount: savings.toFixed(2),
    percentage,
    totalMallPrice,
    totalBestPrice,
  };
};
