import mongoose from 'mongoose';

export interface IUser {
  _id?: string;
  email: string;
  role: 'admin' | 'user';
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
  termsAcceptedAt: Date | null;
  privacyAcceptedAt: Date | null;
  organizationId: mongoose.Schema.Types.ObjectId | null;
}

const userSchema = new mongoose.Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  role: { 
    type: String, 
    enum: ['admin', 'user'],
    default: 'user'
  },
  lastLoginAt: { 
    type: Date,
    default: null
  },
  termsAcceptedAt: {
    type: Date,
    default: null
  },
  privacyAcceptedAt: {
    type: Date,
    default: null
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: false // Optional - null for personal projects
  }
}, {
  timestamps: true
});

// Create indexes
userSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
