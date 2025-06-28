import mongoose from 'mongoose';
import slugify from 'slugify';

export interface IOrganization {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new mongoose.Schema<IOrganization>({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
    minlength: [2, 'Name must be at least 2 characters']
  },
  slug: { 
    type: String, 
    required: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    index: true
  },
  description: { 
    type: String, 
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: '',
    trim: true
  },
  createdAt: { 
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: { 
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      // Ensure dates are properly formatted
      ret.createdAt = ret.createdAt.toISOString();
      ret.updatedAt = ret.updatedAt.toISOString();
      return ret;
    }
  }
});

/**
 * Automatically generates and assigns a URL-friendly slug from the organization name.
 * 
 * The slug is created using the following process:
 * 1. Converts the organization name to lowercase
 * 2. Replaces special characters and spaces with hyphens
 * 3. Ensures uniqueness by appending a number if the slug already exists
 * 
 * Example transformations:
 * - "Acme Corp" → "acme-corp"
 * - "Acme Corp" (if "acme-corp" exists) → "acme-corp-1"
 * 
 * This enables clean URLs and consistent organization identification across the system.
 * The slug is regenerated whenever the organization name changes.
 */
organizationSchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    let baseSlug = slugify(this.name, { lower: true });
    let slug = baseSlug;
    let counter = 1;
    
    // Keep trying new slugs until we find a unique one
    while (true) {
      const existing = await mongoose.models.Organization.findOne({ slug, _id: { $ne: this._id } });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  next();
});

// Create indexes for performance
organizationSchema.index({ slug: 1 }, { unique: true, background: true });
organizationSchema.index({ createdAt: -1 }, { background: true });

export default mongoose.models.Organization || mongoose.model<IOrganization>('Organization', organizationSchema);
