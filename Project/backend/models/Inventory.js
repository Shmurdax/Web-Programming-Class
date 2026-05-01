const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  minimumStock: {
    type: Number,
    default: 50
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  },
  location: String,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inventory', InventorySchema);
