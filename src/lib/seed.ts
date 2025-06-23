import dbConnect from './db';
import User from '@/models/User';

export async function seedDatabase() {
  try {
    await dbConnect();

    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'moldovancsaba@gmail.com' });
    
    if (!adminUser) {
      // Create admin user
      await User.findOneAndUpdate(
        { email: 'moldovancsaba@gmail.com' },
        {
          $set: {
            role: 'admin',
            lastLoginAt: new Date()
          }
        },
        { upsert: true, new: true }
      );
      console.log('Created admin user: moldovancsaba@gmail.com');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
