const mongoose = require('mongoose');
const fs = require('fs');

// Read environment variables from .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const envLines = envFile.split('\n');
for (const line of envLines) {
  if (line.includes('=') && line.trim()) {
    const equalIndex = line.indexOf('=');
    const key = line.substring(0, equalIndex).trim();
    const value = line.substring(equalIndex + 1).trim();
    process.env[key] = value;
  }
}

// Version schema (matching the model)
const versionSchema = new mongoose.Schema({
  version: { 
    type: String, 
    required: true,
    trim: true,
    match: [/^\d+\.\d+\.\d+$/, 'Version must follow semantic versioning (e.g., 2.8.0)']
  },
  description: { 
    type: String, 
    maxLength: [500, 'Description cannot exceed 500 characters'],
    default: '',
    trim: true
  },
  releaseDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true
  }
}, {
  timestamps: true
});

const Version = mongoose.models.Version || mongoose.model('Version', versionSchema);

async function updateVersion(newVersion, description) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Mark all previous versions as inactive
    await Version.updateMany({}, { isActive: false });
    console.log('Marked previous versions as inactive');

    // Create new active version
    const version = new Version({
      version: newVersion,
      description: description || `Version ${newVersion} release`,
      isActive: true
    });

    await version.save();
    console.log(`Version updated to ${newVersion} successfully`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    return version;
  } catch (error) {
    console.error('Error updating version:', error);
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node update-version.js <version> [description]');
  process.exit(1);
}

const newVersion = args[0];
const description = args[1] || `Version ${newVersion} release`;

// Validate version format
const versionRegex = /^\d+\.\d+\.\d+$/;
if (!versionRegex.test(newVersion)) {
  console.error('Error: Version must follow semantic versioning format (e.g., 2.12.1)');
  process.exit(1);
}

// Update version
updateVersion(newVersion, description);
