const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  expected_price: {
    type: Number,
    required: true,
  },
  suggested_price: {
    type: Number,
  },
  photos: [{
    type: String,
  }],
  quality_score: {
    type: String,
    default: 'Pending Analysis',
  },
  status: {
    type: String,
    enum: ['pending_verification', 'available', 'sold'],
    default: 'available',
  },
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
