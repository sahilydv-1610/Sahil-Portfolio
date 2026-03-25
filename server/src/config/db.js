import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error!`);
    console.error(`Please ensure MongoDB is installed and running on your system.`);
    console.error(`Error details: ${error.message}\n`);
    process.exit(1);
  }
};

export default connectDB;
