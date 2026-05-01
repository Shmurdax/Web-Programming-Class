const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    default: 'Yard'
  },
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);
