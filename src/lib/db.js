import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/picito';
const DB_NAME = process.env.DB_NAME || 'picito';

let isConnected = false;

export default async function dbConnect() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  
  // Reset connection flag if mongoose is disconnected
  if (mongoose.connection.readyState === 0) {
    isConnected = false;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME
    });

    isConnected = true;
    console.log('✓ Connected to MongoDB');

    // Handle disconnect events
    mongoose.connection.on('disconnected', () => {
      console.log('⚠ MongoDB disconnected');
      isConnected = false;
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}
