// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    return conn.connection.db; // Return the db object
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;
