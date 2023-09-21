//importing mongoose
import mongoose from 'mongoose';
import { CartSchema } from './Cart';
// OTP schema
const OtpSchema = new mongoose.Schema<IOTPSchema>({
  otp_code: {
    type: Number,
  },
  created_at: {
    type: Number,
  },
  expire_at: {
    type: Number,
  },
});

// Making interface to avoid the TS issues
interface IOTPSchema {
  otp_code: number,
  created_at: number,
  expire_at: number,
}

//UserShema for the user of our e-commerce-application
const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'First name is required']

  },
  last_name: {
    type: String,
    required: [true, 'Last name is required']
  },
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [4, 'Password should be atleast 5 characters long']
  },
  phone_number: {
    type: String,
    requird: true,
    unique: true
  },
  otp: OtpSchema,
  change_pwd: {
    type: Boolean,
    default: false
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart', // Reference the Cart schema
  },
});

const userModel = mongoose.model('User', UserSchema);
const cartModel = mongoose.model('Cart', CartSchema);


export { OtpSchema, userModel, IOTPSchema, cartModel };