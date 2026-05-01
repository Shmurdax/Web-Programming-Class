const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

// Get all sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().populate('productId').sort({ saleDate: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sales for specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const sales = await Sale.find({ productId: req.params.productId }).populate('productId').sort({ saleDate: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create sale
router.post('/', async (req, res) => {
  const sale = new Sale({
    productId: req.body.productId,
    quantity: req.body.quantity,
    totalPrice: req.body.totalPrice,
    customerName: req.body.customerName,
    notes: req.body.notes
  });

  try {
    // Reduce inventory when sale is made
    const inventory = await Inventory.findOne({ productId: req.body.productId });
    if (inventory) {
      inventory.quantity -= req.body.quantity;
      await inventory.save();
    }

    const newSale = await sale.save();
    res.status(201).json(newSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete sale
router.delete('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });

    // Restore inventory when sale is deleted
    const inventory = await Inventory.findOne({ productId: sale.productId });
    if (inventory) {
      inventory.quantity += sale.quantity;
      await inventory.save();
    }

    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sale deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
