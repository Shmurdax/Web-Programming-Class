const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

// Get all inventory
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find().populate('productId');
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get inventory for specific product
router.get('/:productId', async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ productId: req.params.productId }).populate('productId');
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create inventory entry
router.post('/', async (req, res) => {
  const inventory = new Inventory({
    productId: req.body.productId,
    quantity: req.body.quantity,
    minimumStock: req.body.minimumStock,
    location: req.body.location
  });

  try {
    const newInventory = await inventory.save();
    res.status(201).json(newInventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update inventory quantity
router.put('/:productId', async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ productId: req.params.productId });
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });

    if (req.body.quantity !== undefined) inventory.quantity = req.body.quantity;
    if (req.body.minimumStock !== undefined) inventory.minimumStock = req.body.minimumStock;
    if (req.body.location) inventory.location = req.body.location;
    inventory.updatedAt = Date.now();

    const updatedInventory = await inventory.save();
    res.json(updatedInventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete inventory entry
router.delete('/:productId', async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ productId: req.params.productId });
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });

    await Inventory.deleteOne({ productId: req.params.productId });
    res.json({ message: 'Inventory entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
