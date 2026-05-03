// fixCrops.js

const mongoose = require('mongoose');
require('dotenv').config();

// ✅ Use consistent env variable
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mandi_app';

// ✅ Safety check
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables");
  process.exit(1);
}

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ Connected to MongoDB');

  try {
    console.log('🔄 Fixing stuck crops...');

    const db = mongoose.connection.db;

    const result = await db.collection('crops').updateMany(
      { status: 'pending_verification' },
      { $set: { status: 'available' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} crops to 'available'`);
  } catch (err) {
    console.error('❌ Error while updating crops:', err);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});