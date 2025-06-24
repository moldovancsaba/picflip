import mongoose from 'mongoose';

export interface IOrganisation {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const organisationSchema = new mongoose.Schema<IOrganisation>({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [100, 'Organisation name cannot exceed 100 characters'],
    minlength: [2, 'Organisation name must be at least 2 characters']
  },
  slug: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    maxlength: [50, 'Slug cannot exceed 50 characters']
  },
  description: { 
    type: String, 
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes for performance
organisationSchema.index({ slug: 1 }, { unique: true, background: true });
organisationSchema.index({ name: 1 }, { background: true });
organisationSchema.index({ createdAt: -1 }, { background: true });

// Helper function to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Ensure unique slug generation
organisationSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('name')) {
    let baseSlug = generateSlug(this.name);
    let slug = baseSlug;
    let counter = 1;
    
    // Check for existing slug and append number if needed
    while (await mongoose.models.Organisation.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  next();
});

export default mongoose.models.Organisation || mongoose.model<IOrganisation>('Organisation', organisationSchema);
