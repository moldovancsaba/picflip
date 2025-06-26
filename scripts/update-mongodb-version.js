// MongoDB version update script
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const NEW_VERSION = '3.2.1';

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required');
  process.exit(1);
}

async function updateVersion() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`${new Date().toISOString()} - Connected to MongoDB`);

    // Update version in MongoDB
    const Version = mongoose.model('Version', new mongoose.Schema({
      version: String,
      description: String,
      releaseDate: Date,
      isActive: Boolean
    }, { timestamps: true }));

    // Mark all versions as inactive
    await Version.updateMany({}, { isActive: false });

    // Update or create version 3.2.1
    await Version.findOneAndUpdate(
      { version: NEW_VERSION },
      {
        version: NEW_VERSION,
        description: `Version ${NEW_VERSION} - Admin edit flow selectors & validation checks`,
        releaseDate: new Date(),
        isActive: true
      },
      { upsert: true, new: true }
    );
    console.log(`${new Date().toISOString()} - Successfully updated version to ${NEW_VERSION}`);
  } catch (error) {
    console.error(`${new Date().toISOString()} - Error updating version:`, error);
  } finally {
    await mongoose.disconnect();
    console.log(`${new Date().toISOString()} - Disconnected from MongoDB`);
  }
}

updateVersion();
