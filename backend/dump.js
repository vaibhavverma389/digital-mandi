const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mandi')
  .then(async () => {
    const db = mongoose.connection.db;
    const crops = await db.collection('crops').find({}).toArray();
    console.log(JSON.stringify(crops, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
