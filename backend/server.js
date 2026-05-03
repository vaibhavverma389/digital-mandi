const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/crops', require('./routes/crops.routes'));
app.use('/api/bids', require('./routes/bids.routes'));
app.use('/api/ai', require('./routes/ai.routes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
