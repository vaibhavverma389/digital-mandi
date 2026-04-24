const Crop = require('../models/crop.model');
const ImageKit = require('imagekit');

// Configure ImageKit
let imagekit;
try {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'your_public_key',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'your_private_key',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/your_endpoint'
  });
} catch (error) {
  console.log("ImageKit config error (will fail on upload if keys are bad):", error.message);
}
// Controller for crop-related functionalities
exports.createCrop = async (req, res) => {
  try {
    const { type, quantity, expected_price, quality_score } = req.body;
    let photos = [];

    if (req.file && imagekit) {
      const response = await imagekit.upload({
        file: req.file.buffer, // upload buffer
        fileName: req.file.originalname,
        folder: '/crops'
      });
      photos.push(response.url);
    }

    const newCrop = new Crop({
      farmer_id: req.user.id,
      type,
      quantity,
      expected_price,
      photos,
      quality_score: quality_score || 'Pending Analysis',
      status: 'available' // Default status changed to available for MVP
    });

    const crop = await newCrop.save();
    res.status(201).json(crop);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// this route to get all crops with optional filters for type, price, and search
exports.getAllCrops = async (req, res) => {
  try {
    const { type, max_price, search } = req.query;
    
    let query = { status: 'available' };
    
    if (type) {
      query.type = type;
    }
    
    if (max_price) {
      query.expected_price = { $lte: Number(max_price) };
    }
    
    if (search) {
      query.$or = [
        { type: { $regex: search, $options: 'i' } }
      ];
    }

    const crops = await Crop.find(query).populate('farmer_id', ['name', 'location']);
    res.json(crops);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// this route to get all crops for a specific farmer
exports.getFarmerCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ farmer_id: req.user.id });
    res.json(crops);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// this route to update the status of a crop by a farmer
exports.updateCropStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let crop = await Crop.findById(req.params.id);
    
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    crop.status = status;
    await crop.save();

    res.json(crop);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
