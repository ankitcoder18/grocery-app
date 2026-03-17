// server/routes/shoppingRoutes.js
const express = require('express');
const ShoppingSession = require('../models/ShoppingSession');
const router = express.Router();

// Helper: compute bestVendor and totals for a session
const computeTotals = (items) => {
  let totalBestPrice = 0;
  let totalMaxPrice = 0;

  const processedItems = items.map((item) => {
    const vendorPrices = item.vendorPrices || [];

    // Recalculate totalAmount per vendor based on qty * pricePerUnit
    const enrichedPrices = vendorPrices.map((vp) => ({
      ...vp,
      totalAmount: +(item.quantity * vp.pricePerUnit).toFixed(2),
    }));

    // Best = lowest pricePerUnit
    const valid = enrichedPrices.filter((vp) => vp.pricePerUnit > 0);
    const best = valid.length
      ? valid.reduce((a, b) => (a.pricePerUnit < b.pricePerUnit ? a : b))
      : null;

    // Max = highest pricePerUnit
    const worst = valid.length
      ? valid.reduce((a, b) => (a.pricePerUnit > b.pricePerUnit ? a : b))
      : null;

    if (best) totalBestPrice += best.totalAmount;
    if (worst) totalMaxPrice += worst.totalAmount;

    return {
      ...item,
      vendorPrices: enrichedPrices,
      bestVendor: best
        ? { name: best.vendorName, pricePerUnit: best.pricePerUnit, totalAmount: best.totalAmount }
        : null,
    };
  });

  return {
    processedItems,
    totalBestPrice: +totalBestPrice.toFixed(2),
    totalMaxPrice: +totalMaxPrice.toFixed(2),
    totalSavings: +(totalMaxPrice - totalBestPrice).toFixed(2),
  };
};

// GET all sessions (newest first)
router.get('/', async (req, res) => {
  try {
    const sessions = await ShoppingSession.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single session
router.get('/:id', async (req, res) => {
  try {
    const session = await ShoppingSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new session
router.post('/', async (req, res) => {
  try {
    const { sessionName, notes, items = [], status } = req.body;
    const { processedItems, totalBestPrice, totalMaxPrice, totalSavings } = computeTotals(items);

    const session = new ShoppingSession({
      sessionName,
      notes,
      status: status || 'draft',
      items: processedItems,
      totalBestPrice,
      totalMaxPrice,
      totalSavings,
    });

    const saved = await session.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH update session (add/edit items, complete it, etc.)
router.patch('/:id', async (req, res) => {
  try {
    const session = await ShoppingSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const items = req.body.items !== undefined ? req.body.items : session.items;
    const { processedItems, totalBestPrice, totalMaxPrice, totalSavings } = computeTotals(items);

    Object.assign(session, {
      ...req.body,
      items: processedItems,
      totalBestPrice,
      totalMaxPrice,
      totalSavings,
    });

    const updated = await session.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE session
router.delete('/:id', async (req, res) => {
  try {
    const session = await ShoppingSession.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
