const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const aiController = require('../controllers/aiController');
// this route to check the quality of a crop by a farmer
router.post('/quality-check', protect, aiController.qualityCheck);
// this route to predict the price of a crop by a farmer
router.post('/predict-price', protect, aiController.predictPrice);

module.exports = router;
