import mongoose from 'mongoose';
import { IframeConfig } from '@/lib/types';

const iframeConfigSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  slug: { 
    type: String, 
    required: false,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    maxlength: [50, 'Slug cannot exceed 50 characters']
  },
  contentUrl: { type: String, required: true },
  originalWidth: { type: Number, required: true },
  originalHeight: { type: Number, required: true },
  aspectRatioX: { type: Number, required: true },
  aspectRatioY: { type: Number, required: true },
  backgroundColor: { type: String, required: true },
  backgroundImageUrl: { type: String, default: '' },
  horizontalAlignment: { 
    type: String, 
    enum: ['left', 'center', 'right'],
    default: 'center'
  },
  verticalAlignment: { 
    type: String, 
    enum: ['top', 'middle', 'bottom'],
    default: 'middle'
  },
  isPublic: {
    type: Boolean,
    default: false // Default to private for security
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: false // Optional - null for personal projects
  }
});

const settingsSchema = new mongoose.Schema({
  configs: {
    type: Map,
    of: new mongoose.Schema({
      id: String,
      name: String,
      slug: { 
        type: String, 
        required: false,
        lowercase: true,
        trim: true
      },
      contentUrl: String,
      originalWidth: Number,
      originalHeight: Number,
      aspectRatioX: Number,
      aspectRatioY: Number,
      backgroundColor: String,
      backgroundImageUrl: { type: String, default: '' },
      horizontalAlignment: { 
        type: String, 
        enum: ['left', 'center', 'right'],
        default: 'center'
      },
      verticalAlignment: { 
        type: String, 
        enum: ['top', 'middle', 'bottom'],
        default: 'middle'
      },
      isPublic: {
        type: Boolean,
        default: false // Default to private for security
      },
      organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: false // Optional - null for personal projects
      }
    }, { _id: false })
  }
});

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
