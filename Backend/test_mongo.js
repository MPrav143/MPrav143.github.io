const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

async function test() {
  console.log('MONGO_URI from env:', process.env.MONGO_URI ? 'FOUND' : 'NOT FOUND');
  if (process.env.MONGO_URI) {
    console.log('Connecting to:', process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@'));
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // fail fast in 5 seconds
    });
    console.log('Success! Connected to MongoDB.');
    console.log('Database name:', mongoose.connection.name);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
  process.exit(0); // Exit process manually
}

test();
