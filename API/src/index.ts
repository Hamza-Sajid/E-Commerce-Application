// Importing configuration packages
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
// Importing config files
import logger from './util/debugger';
// Importing the DB config file
import connectToDb from './config/dbConnection';
// Importing the models
import authRoutes from './modules/auth/authRoutes';
import productRoutes from './modules/products/productRoutes';
import userRoutes from './modules/user/userRoutes';
import cartRoutes from './modules/cart/cartRoutes';


// Intializing the packages
dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.PORT;



// Making connection to the backend
connectToDb();

// App route (Main)
app.post('/home', (req, res) => {
  res.send('Welcome to e-commerce app');
});

// Auth routes
app.use('/auth', authRoutes);

// User Route
app.use("/user", userRoutes)

// Product Routes
app.use("/product", productRoutes)

// Cart Routes
app.use("/cart", cartRoutes)

// Listening app
app.listen(PORT, () => {
  logger.info(`App is running on port-no : ${PORT}`);
});