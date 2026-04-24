const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const cropController = require('../controllers/cropController');

const upload = multer({ storage: multer.memoryStorage() });
// Adding former crop creation route with image upload
router.post('/', protect, authorize('Farmer'), upload.single('image'), cropController.createCrop);

// This route to get all crops for both farmers 
router.get('/', cropController.getAllCrops);
// This route to get crops for a specific farmer
router.get('/farmer', protect, authorize('Farmer'), cropController.getFarmerCrops);

router.put('/:id/status', protect, authorize('Admin'), cropController.updateCropStatus);

module.exports = router;
