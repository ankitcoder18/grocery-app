// client/src/components/GroceryList.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GroceryCard from './GroceryCard';
import SearchBar from './SearchBar';
import { groceryApi } from '../api/groceryApi';
import { FiFilter, FiList, FiGrid } from 'react-icons/fi';

const GroceryList = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterSource, setFilterSource] = useState('all');

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchQuery, filterSource]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await groceryApi.getAllItems();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      fetchItems();
    } else {
      try {
        const response = await groceryApi.searchItems(query);
        setItems(response.data);
      } catch (error) {
        console.error('Error searching items:', error);
      }
    }
  };

  const filterItems = () => {
    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterSource !== 'all') {
      filtered = filtered.filter(
        (item) => item.bestPrice?.source?.toLowerCase() === filterSource.toLowerCase()
      );
    }

    setFilteredItems(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🛒</div>
          <p className="text-gray-600">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search for rice, flour, oil... 🔍"
          loading={loading}
        />

        <div className="flex flex-wrap gap-3 items-center">
          {/* Filter Buttons */}
          <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
            <FiFilter className="text-gray-600" />
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-gray-700 font-medium cursor-pointer"
            >
              <option value="all">All Sources</option>
              <option value="mall">🏬 Mall</option>
              <option value="online">🛒 Online</option>
              <option value="local">🏪 Local</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-600'
              }`}
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-600'
              }`}
            >
              <FiList />
            </button>
          </div>

          {/* Results Count */}
          <div className="ml-auto text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg font-medium">
            {filteredItems.length} items found
          </div>
        </div>
      </div>

      {/* Items Display */}
      {filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-gray-600 text-lg">No items found</p>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {filteredItems.map((item, index) => (
              <GroceryCard key={item._id || index} item={item} index={index} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default GroceryList;
