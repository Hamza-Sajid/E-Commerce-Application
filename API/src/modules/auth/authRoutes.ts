// Importing express
import express from 'express';
// Importig the middlewares
import { validateEmail, validateLoginUser, validateNewPassword, validateRegisterUser } from './authMiddleware';
// Importing controllers
import { forgetPassword, loginUser, registerUser, resetPassword, verifyNewAccount, verifyOTP, verifyPayment } from './authController';

// Making a router from express
const authRoutes = express.Router();

// Defining route
authRoutes.post('/register', validateRegisterUser, registerUser);
authRoutes.get('/verify_account/:id', verifyNewAccount);
authRoutes.post('/login', validateLoginUser, loginUser);
authRoutes.post('/forget_pwd', validateEmail, forgetPassword);
authRoutes.post('/verify_otp', verifyOTP);
authRoutes.post('/new_pwd', validateNewPassword, resetPassword);
authRoutes.post("/payment", verifyPayment)



// Exporting our function
export default authRoutes;