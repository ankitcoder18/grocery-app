// server/routes/groceryRoutes.js
const express = require('express');
const GroceryItem = require('../models/GroceryItem');
const router = express.Router();

// Get all grocery items
router.get('/', async (req, res) => {
  try {
    const items = await GroceryItem.find().sort({ name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search grocery items
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const items = await GroceryItem.find({
      name: { $regex: query, $options: 'i' },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get best prices summary
router.get('/prices/summary', async (req, res) => {
  try {
    const items = await GroceryItem.find();
    const summary = items.map((item) => ({
      name: item.name,
      bestPrice: item.bestPrice,
      quantity: item.quantity,
      unit: item.unit,
    }));
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await GroceryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new item
router.post('/', async (req, res) => {
  const item = new GroceryItem(req.body);
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update item
router.patch('/:id', async (req, res) => {
  try {
    const item = await GroceryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    Object.assign(item, req.body);
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    const item = await GroceryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
