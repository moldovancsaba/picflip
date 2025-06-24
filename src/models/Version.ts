import mongoose from 'mongoose';

export interface IVersion {
  _id?: string;
  version: string;
  description?: string;
  releaseDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const versionSchema = new mongoose.Schema<IVersion>({
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

// Helper function to get current active version
export async function getCurrentVersion(): Promise<string> {
  try {
    const currentVersion = await mongoose.models.Version.findOne({ isActive: true })
      .sort({ releaseDate: -1 })
      .lean() as IVersion | null;
    
    return currentVersion ? currentVersion.version : '2.10.0'; // fallback to current version
  } catch (error) {
    console.error('Error fetching current version:', error);
    return '2.10.0'; // fallback version
  }
}

// Helper function to update version
export async function updateVersion(newVersion: string, description?: string): Promise<IVersion> {
  try {
    // Mark all previous versions as inactive
    await mongoose.models.Version.updateMany({}, { isActive: false });
    
    // Create new active version
    const version = new (mongoose.models.Version || mongoose.model<IVersion>('Version', versionSchema))({
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

export default mongoose.models.Version || mongoose.model<IVersion>('Version', versionSchema);
