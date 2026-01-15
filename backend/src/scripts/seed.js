import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Item from '../models/Item.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedDatabase = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding');

    // 1. Seed Admin User
    const adminEmail = 'admin@findit.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: 'admin123', // Will be hashed by pre-save hook
        role: 'admin',
        username: 'admin',
        verified: true,
      });
      console.log('Admin user created: admin@findit.com / admin123');
    } else {
      console.log('ℹAdmin user already exists');
    }

    // 2. Seed Sample Item (Optional - only if empty)
    const itemCount = await Item.countDocuments();
    if (itemCount === 0 && adminExists) {
      await Item.create({
        title: 'Sample Found Keys',
        description: 'Found a set of keys near the main gate.',
        category: 'Keys',
        status: 'FOUND',
        location: 'Main Gate',
        date: new Date(),
        postedBy: adminExists._id,
        contactName: 'Admin',
        contactEmail: adminEmail,
        isResolved: false
      });
      console.log('✅ Sample item created');
    }

    console.log('🌱 Seeding verified/completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
