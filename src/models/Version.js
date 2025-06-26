import mongoose from 'mongoose';

const versionSchema = new mongoose.Schema({
  version: { 
    type: String, 
    required: true,
    trim: true,
    match: [/^\d+\.\d+\.\d+$/, 'Version must follow semantic versioning (e.g., 2.8.0)']
  },
  description: { 
    type: String, 
    maxlength: [500, 'Description cannot exceed 500 characters'],
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

// Create indexes for performance
versionSchema.index({ version: 1 }, { unique: true, background: true });
versionSchema.index({ isActive: 1, releaseDate: -1 }, { background: true });
versionSchema.index({ createdAt: -1 }, { background: true });

/**
 * Retrieves the current active version from MongoDB using a deterministic strategy:
 * 1. Queries for the most recent active version (isActive: true) by releaseDate
 * 2. If no version exists, auto-seeds v0.0.1 as initial version
 * 
 * This function implements strict MongoDB-first versioning where:
 * - MongoDB is the single source of truth (SoT) for all version data
 * - No fallbacks to package.json or other sources are allowed
 * - Database errors result in explicit exceptions for reliability
 * 
 * @returns {Promise<string>} The current semantic version string (e.g. "0.0.1")
 * @throws {Error} If database operations fail, with specific error context
 */
export async function getCurrentVersion() {
  try {
    const currentVersion = await mongoose.models.Version.findOne({ isActive: true })
      .sort({ releaseDate: -1 })
      .lean();
    
    if (!currentVersion) {
      // Auto-seed initial version if no version exists
      // This ensures system can bootstrap itself without external dependencies
      const version = await updateVersion('0.0.1', 'Initial auto-seed – MongoDB SoT');
      return version.version;
    }
    
    return currentVersion.version;
  } catch (error) {
    // Explicitly throw database errors to ensure reliability
    // This prevents silent failures and ensures proper error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Database error: Failed to retrieve or initialize version: ${errorMessage}`);
  }
}

// Helper function to update version
export async function updateVersion(newVersion, description) {
  try {
    // Mark all previous versions as inactive
    await mongoose.models.Version.updateMany({}, { isActive: false });
    
    // Create new active version
    const version = new (mongoose.models.Version || mongoose.model('Version', versionSchema))({
      version: newVersion,
      description: description || `Version ${newVersion} release`,
      isActive: true
    });
    
    await version.save();
    return version;
  } catch (error) {
    console.error('Error updating version:', error);
    throw error;
  }
}

export default mongoose.models.Version || mongoose.model('Version', versionSchema);
