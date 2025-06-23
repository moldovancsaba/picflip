import dbConnect from './db';
import User from '@/models/User';

export async function seedDatabase() {
  try {
    await dbConnect();

    // Check if admin user exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      // Create admin user
      await User.create({
        email: 'admin@picito.com',
        role: 'admin',
        lastLoginAt: new Date()
      });
      console.log('Created admin user: admin@picito.com');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
