import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/picito';
const DB_NAME = process.env.DB_NAME || 'picito';

let isConnected = false;

export default async function dbConnect() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      // Mongoose 7+ default options for stable connection
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    isConnected = true;
    console.log('✓ Connected to MongoDB');

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}
