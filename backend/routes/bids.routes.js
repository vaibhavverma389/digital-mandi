const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const bidController = require('../controllers/bidController');

// this route to place a bid on a crop by a trader
router.post('/', protect, authorize('Trader'), bidController.placeBid);
// this route to get all bids for a specific crop
router.get('/crop/:crop_id', protect, bidController.getBidsForCrop);
// this route to get all bids for a specific farmer and trader
router.get('/farmer', protect, authorize('Farmer'), bidController.getFarmerBids);
// this route to get all bids for a specific trader
router.get('/trader', protect, authorize('Trader'), bidController.getTraderBids);
/// this route to update the status of a bid by a farmer
router.put('/:id/status', protect, authorize('Farmer'), bidController.updateBidStatus);

module.exports = router;
