import mongoose from 'mongoose';

export interface IMember {
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  addedAt: Date;
}

export interface IOrganization {
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  members: IMember[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new mongoose.Schema<IMember>({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const organizationSchema = new mongoose.Schema<IOrganization>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  logoUrl: {
    type: String,
    trim: true,
    default: ''
  },
  members: {
    type: [memberSchema],
    default: [],
    validate: {
      validator: function(members: IMember[]) {
        // Ensure at least one admin exists
        return members.some(member => member.role === 'admin');
      },
      message: 'Organization must have at least one admin'
    }
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes
organizationSchema.index({ slug: 1 });
organizationSchema.index({ 'members.email': 1 });
organizationSchema.index({ createdAt: -1 });

// Add methods for member management
organizationSchema.methods.addMember = function(email: string, role: IMember['role']) {
  if (this.members.find(m => m.email === email)) {
    throw new Error('Member already exists');
  }
  this.members.push({ email, role, addedAt: new Date() });
};

organizationSchema.methods.updateMemberRole = function(email: string, newRole: IMember['role']) {
  const member = this.members.find(m => m.email === email);
  if (!member) {
    throw new Error('Member not found');
  }
  member.role = newRole;
};

organizationSchema.methods.removeMember = function(email: string) {
  const adminCount = this.members.filter(m => m.role === 'admin').length;
  const member = this.members.find(m => m.email === email);
  
  if (!member) {
    throw new Error('Member not found');
  }
  
  if (member.role === 'admin' && adminCount <= 1) {
    throw new Error('Cannot remove the last admin');
  }
  
  this.members = this.members.filter(m => m.email !== email);
};

// Helper method to generate a unique slug
organizationSchema.statics.generateUniqueSlug = async function(name: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  let slug = baseSlug;
  let counter = 1;
  
  while (await this.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

export default mongoose.models.Organization || mongoose.model<IOrganization>('Organization', organizationSchema);
