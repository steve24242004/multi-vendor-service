import mongoose from 'mongoose';

/**
 * This function connects the application to the MongoDB database.
 * It uses the connection string stored in the environment variables.
 */
const connectDB = async () => {
  try {
    // Attempt to connect to the database
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected !!`);
  } catch (error) {
    // If the connection fails, log the error and exit the application
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure code 1
  }
};

export default connectDB;

