const Bid = require('../models/bid.model');
const Crop = require('../models/crop.model');

exports.placeBid = async (req, res) => {
  try {
    const { crop_id, bid_amount } = req.body;

    const crop = await Crop.findById(crop_id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    if (crop.status !== 'available') {
      return res.status(400).json({ message: 'Crop is not available for bidding' });
    }

    const newBid = new Bid({
      crop_id,
      trader_id: req.user.id,
      bid_amount
    });

    const bid = await newBid.save();
    res.status(201).json(bid);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getBidsForCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.crop_id);
    
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    if (crop.farmer_id.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to view these bids' });
    }

    const bids = await Bid.find({ crop_id: req.params.crop_id }).populate('trader_id', ['name', 'phone']);
    res.json(bids);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getFarmerBids = async (req, res) => {
  try {
    const crops = await Crop.find({ farmer_id: req.user.id });
    const cropIds = crops.map(c => c._id);
    const bids = await Bid.find({ crop_id: { $in: cropIds } })
      .populate('trader_id', ['name', 'phone', 'email'])
      .populate('crop_id', ['type']);
    res.json(bids);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getTraderBids = async (req, res) => {
  try {
    const bids = await Bid.find({ trader_id: req.user.id })
      .populate({
        path: 'crop_id',
        select: ['type', 'farmer_id', 'expected_price', 'quantity'],
        populate: {
          path: 'farmer_id',
          select: ['name', 'phone', 'email']
        }
      });
    res.json(bids);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateBidStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    const crop = await Crop.findById(bid.crop_id);
    if (crop.farmer_id.toString() !== req.user.id) {
       return res.status(403).json({ message: 'Not authorized to update this bid' });
    }

    bid.status = status;
    await bid.save();

    // If accepted, update crop status to sold
    if (status === 'accepted') {
      crop.status = 'sold';
      await crop.save();
      
      // Optionally reject all other pending bids for this crop
      await Bid.updateMany(
        { crop_id: bid.crop_id, _id: { $ne: bid._id } },
        { $set: { status: 'rejected' } }
      );
    }

    res.json(bid);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
