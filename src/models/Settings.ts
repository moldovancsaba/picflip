import mongoose from 'mongoose';
import { IframeConfig } from '@/lib/types';

const iframeConfigSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
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
  }
});

const settingsSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  configs: {
    type: Map,
    of: new mongoose.Schema({
      id: String,
      name: String,
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
      }
    }, { _id: false })
  }
});

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
