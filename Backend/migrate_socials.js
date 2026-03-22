const mongoose = require('mongoose');
const About = require('./models/About');
const SocialLink = require('./models/SocialLink');
const dotenv = require('dotenv');

dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for migration');

        const profile = await About.findOne();
        if (!profile || !profile.socialLinks) {
            console.log('No social links found in profile to migrate.');
            process.exit(0);
        }

        const links = profile.socialLinks;
        const insertPromises = [];

        if (links.linkedin) {
            insertPromises.push(SocialLink.create({ platform: 'LinkedIn', url: links.linkedin }));
            console.log('Migrated LinkedIn');
        }
        if (links.github) {
            insertPromises.push(SocialLink.create({ platform: 'GitHub', url: links.github }));
            console.log('Migrated GitHub');
        }
        if (links.portfolio) {
            insertPromises.push(SocialLink.create({ platform: 'Portfolio', url: links.portfolio }));
            console.log('Migrated Portfolio');
        }

        await Promise.all(insertPromises);
        console.log('Migration complete. You can delete this script.');
        process.exit(0);
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
};

migrate();
