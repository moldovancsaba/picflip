import mongoose from 'mongoose';

export interface IUser {
  email: string;
  role: 'admin' | 'user';
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
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
  }
}, {
  timestamps: true
});

// Create indexes
userSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
