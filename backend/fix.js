const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mandi_app')
  .then(async () => {
    console.log('Connected to DB. Fixing stuck crops...');
    const db = mongoose.connection.db;
    const result = await db.collection('crops').updateMany(
      { status: 'pending_verification' },
      { $set: { status: 'available' } }
    );
    console.log(`Updated ${result.modifiedCount} crops to 'available'.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
