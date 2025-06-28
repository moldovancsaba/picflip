const mongoose = require('mongoose');

/**
 * Organization Schema
 * Defines the structure and validation rules for organization documents
 * - Includes compound unique index for {slug, workspace}
 * - Enforces ISO 8601 timestamp format
 * - All required fields have validation
 */
const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Name cannot be empty'
    }
  },
  slug: {
    type: String,
    required: [true, 'Organization slug is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^[a-z0-9-]+$/.test(v);
      },
      message: 'Slug must contain only lowercase letters, numbers, and hyphens'
    }
  },
  workspace: {
    type: String,
    required: [true, 'Workspace identifier is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Workspace cannot be empty'
    }
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => new Date().toISOString(),
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v) && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v.toISOString());
      },
      message: 'Invalid ISO 8601 date format with milliseconds (YYYY-MM-DDTHH:mm:ss.sssZ)'
    }
  },
  updatedAt: {
    type: Date,
    required: true,
    default: () => new Date().toISOString(),
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v) && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v.toISOString());
      },
      message: 'Invalid ISO 8601 date format with milliseconds (YYYY-MM-DDTHH:mm:ss.sssZ)'
    }
  }
}, {
  // Enable timestamps to automatically handle updatedAt
  timestamps: true,
  
  // Ensure toJSON transforms dates to ISO format
  toJSON: {
    transform: function(doc, ret) {
      if (ret.createdAt) ret.createdAt = ret.createdAt.toISOString();
      if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toISOString();
      return ret;
    }
  }
});

// Remove any existing indexes to prevent duplicates
organizationSchema.clearIndexes();

// Create compound unique index for slug and workspace
organizationSchema.index({ slug: 1, workspace: 1 }, { unique: true });

// Add indexes for frequently queried fields
organizationSchema.index({ workspace: 1 }); // For workspace-based queries
organizationSchema.index({ createdAt: 1 }); // For date-based queries
organizationSchema.index({ updatedAt: 1 }); // For date-based queries

// Pre-save middleware to ensure dates are in ISO format
organizationSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = new Date().toISOString();
  }
  if (this.isNew) {
    this.createdAt = new Date().toISOString();
  }
  next();
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
