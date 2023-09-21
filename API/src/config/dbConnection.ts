// Package imports
import mongoose from 'mongoose';
// Importing the logger function to make logs
import logger from '../util/debugger';

/**
 * Fucntion to make a connection with the mongodb atlas
 */
const ConnectToDB = async () => {
  try {
    // Importing the dotenv config variables
    const mongoUrl = process.env.MONGO_URL;
    const connect = await mongoose.connect(mongoUrl ?? 'undefined');
    logger.info(`DB got connected successfully! ${connect}`);
  } catch (error) {
    logger.error(`DB connection failed ${error}`);
    process.exit(1)
  }
};

//Exporting the function
export default ConnectToDB;

// End of File (EOF)
