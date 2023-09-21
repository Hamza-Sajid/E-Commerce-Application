// importing dotenv config
import dotenv from 'dotenv';
dotenv.config();

//importing cloudnary library
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET,
});
export default cloudinary;

// End of File (EOF)
