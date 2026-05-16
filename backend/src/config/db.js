/**
  db.js
  Database connection and configuration setup.
 */
import mongoose from 'mongoose';
import envConfig from '../config/envConfig.js';

const connectDB = async () => {
    try {
        const connectionString = envConfig.connectionString;
        if (!connectionString) {
            throw new Error('Connection string is not defined in environment variables');
        }
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}
export default connectDB;
