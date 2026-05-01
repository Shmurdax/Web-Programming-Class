const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  customerName: String,
  saleDate: {
    type: Date,
    default: Date.now
  },
  notes: String
});

module.exports = mongoose.model('Sale', SaleSchema);
