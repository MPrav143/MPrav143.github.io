const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const About = require('./models/About');
console.log('About model loaded successfully.');


console.log('MONGO_URI from env:', process.env.MONGO_URI ? 'FOUND' : 'NOT FOUND');
if (process.env.MONGO_URI) {
  console.log('Connecting to MONGO_URI...');
}

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {

    const fs = require('fs');
    let log = '';
    const print = (text) => {
      console.log(text);
      log += text + '\n';
    };

    print('Connected to MongoDB');
    print('Database Name: ' + mongoose.connection.name);

    // List all collections to verify About exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    print('Collections present: ' + JSON.stringify(collections.map(c => c.name)));

    const profiles = await About.find();
    print(`Found ${profiles.length} profile(s) in About collection.`);

    if (profiles.length === 0) {
      print('No profiles found in the database.');
    } else {
      print('Existing profile IDs: ' + JSON.stringify(profiles.map(p => p._id.toString())));
    }

    const testId = '693a5763589e23cc54ebdf61';
    print(`Attempting update on profile with ID: ${testId}`);

    const updated = await About.findByIdAndUpdate(testId, {
      sectionBackgrounds: {
        hero: 'https://example.com/test-bg.jpg',
        about: 'https://example.com/about-bg.jpg'
      }
    }, { new: true });

    if (!updated) {
      print(`Update FAILED: Document with ID ${testId} not found.`);
    } else {
      print('Update result inside node testing: ' + JSON.stringify(updated.sectionBackgrounds));
    }

    fs.writeFileSync(path.resolve(__dirname, 'inspect_result.txt'), log);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error during execution:', err);
  });


