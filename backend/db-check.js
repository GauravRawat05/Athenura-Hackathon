import mongoose from 'mongoose';
import User from './src/modules/users/user.model.js';
import Hackathon from './src/modules/admin/hackathons/hackathon.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkDb() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('Connected successfully to MONGODB');
  
  const hackathons = await Hackathon.find({}, '_id title status');
  console.log('\n--- HACKATHONS ---');
  console.log(hackathons);
  
  const usersGrouped = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);
  console.log('\n--- USERS BY ROLE ---');
  console.log(usersGrouped);

  const judges = await User.find({ role: { $regex: /judge/i } }, 'fullName email role');
  console.log('\n--- JUDGE USERS ---');
  console.log(judges);

  await mongoose.disconnect();
}

checkDb().catch(console.error);
