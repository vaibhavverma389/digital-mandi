const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  crop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: true,
  },
  trader_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bid_amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Bid', bidSchema);
