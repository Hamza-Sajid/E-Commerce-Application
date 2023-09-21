
// Importing express and relvent packages
import { Request, Response } from 'express';
// Importing the http status codes
import { StatusCodes } from '../../config/statusCodes';
// Importing http msg responces
import ResponseMessages from '../../config/messageCodes';
// Importing helper methods
const stripe = require('stripe')('sk_test_51NkiTXDVBFckkCRayJ2NP8oEeZsOPEkGYXnH2NlDmN58mgwwDGpxgCh9oEtAvxW5arkwLvSaMFY7qri3mAad1omm00Qrviry5g');
import { generateOTP, generateRandomNumber, isOtpVerified, sendAcountVerificationEmail, sendRestPasswordEmail } from './authConstants';
import { emailVerificationHTMLCode } from '../../util/emailHTMLCode';
import { generateToken, getUserByEmail, existingUser, hashingPassword, registerUserInDb, findUserInDb, findByIdAndUpdateStatus, unHashingPassword, handleOtpProcess, updateOtp, updatePassword } from './authServices';


/**
 * LOGIN USER API LOGIC
 * @param req : Request
 * @param res : Response
 */
const loginUser = async (req: Request, res: Response) => {
  // Getting input from user
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    //If user not found send 404 responce
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: 0,
        message: ResponseMessages.USER_NOT_FOUND,
      });
    }
    if (user.is_verified == false) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: 0,
        message: ResponseMessages.UNAUTHORIZED
      });
    }
    // Now un-hashing the password

    // const unhashed = await bcrypt.compare(password, user.password);
    const unhashed = await unHashingPassword(password, user.password)
    if (!unhashed) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: 0,
        message: ResponseMessages.USER_NOT_FOUND,
      });
    }
    // Getting a token based on the user[_id]
    const token = await generateToken(user)

    return res.status(StatusCodes.SUCCESS).json({
      success: 1,
      message: ResponseMessages.LOGIN_SUCCESS,
      data: { token }
    });
  }
  catch (e) {
    res.status(StatusCodes.SERVER_ERROR).json({
      success: 0,
      message: ResponseMessages.SOMETHING_WENT_WRONG
    });
  }

};

/**
 * REGISTER USER API LOGIC
 * @param req :Request
 * @param res :Response
 */
const registerUser = async (req: Request, res: Response) => {

  // Getting all the request data
  const { first_name, last_name, email, password } = req.body;

  // Checking if email already exists or not?
  const userDetails = await existingUser(email, password);

  if (userDetails) {
    return res.status(StatusCodes.ALREADY_EXSISTS).json({
      success: 0,
      message: ResponseMessages.ALREADY_EXSISTS
    });
  }

  try {
    // Saving user in db
    const user = await registerUserInDb(req)
    if (user == true) {
      // Returning success message
      return res.status(StatusCodes.SUCCESS).json({
        success: 1,
        message: ResponseMessages.REGISTER_SUCCESS
      });
    }
  }
  catch (error) {
    return res
      .status(StatusCodes.SERVER_ERROR)
      .json({
        success: 0,
        message: ResponseMessages.SOMETHING_WENT_WRONG
      });
  }

};

/**
 * FORGET PASSWORD API LOGIC
 * @param req :Request
 * @param res :Response
 */
const forgetPassword = async (req: Request, res: Response) => {
  // Getting email from request body
  const { email } = req.body;

  //Finding user in our DB with given Email@
  const user = await findUserInDb(email)

  if (!user || user.is_verified == false) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: 0,
      message: ResponseMessages.USER_NOT_FOUND
    });
  }
  try {
    // Receving the random token (otp) into otp variable
    const otp = generateOTP();

    // Storing the otp in our user database
    await handleOtpProcess(user, otp)

    res.status(StatusCodes.SUCCESS).json({
      success: 1,
      message: ResponseMessages.PASSWORD_SENT
    });
  }
  // Handling the error
  catch (error) {
    res.status(StatusCodes.SERVER_ERROR).send({
      success: 0,
      message: ResponseMessages.SOMETHING_WENT_WRONG
    });
  }
};

/**
 *  VERIFY OTP API LOGIC
 * @param req :Request
 * @param res :Response
 */
const verifyOTP = async (req: Request, res: Response) => {

  //Getting input from users
  const { email, otp } = req.body;
  console.log(email, otp);

  // If any input is empty or invalid
  if (!otp || !email) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: 0,
      message: ResponseMessages.INVALID_DATA
    });
  }
  //Finding user in our DB with given Email@
  const user = await findUserInDb(email)

  //If user not exsists
  if (!user || !user.otp
  ) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: 1,
      message: ResponseMessages.USER_NOT_FOUND
    });
  }

  // Verifying is our otp valid or expired
  const otpValidation = isOtpVerified(user.otp);

  const responce = await updateOtp(user, otp, otpValidation)
  // Verifying user given otp with generated otp
  if (responce == true) {
    // Sending the responce
    return res.status(StatusCodes.SUCCESS).json({
      success: 1,
      message: ResponseMessages.ENTER_NEW_DATA
    });
  }

  // If user input invalid otp
  else {
    return res.status(StatusCodes.NOT_FOUND).json({
      sucess: 0,
      message: ResponseMessages.USER_NOT_FOUND
    });
  }
};

/**
 * RESET PASSWORD [INPUT] API LOGIC
 * @param req :Request
 * @param res :Response
 */
const resetPassword = async (req: Request, res: Response) => {
  //Getting input values from user
  const { email, password } = req.body;
  //Finding if user is there or not
  const user = await findUserInDb(email)
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: 0,
      message: ResponseMessages.USER_NOT_FOUND
    });
  }
  //If user exists just update the password and delete the field of changePwd
  const response = await updatePassword(user, password)
  if (response == true) {
    return res.status(StatusCodes.SUCCESS).json({
      sucess: 1,
      message: ResponseMessages.UPDATED
    });

  }
  //If something went wrong
  else {
    return res.status(StatusCodes.SERVER_ERROR).json({
      success: 0,
      message: ResponseMessages.SOMETHING_WENT_WRONG
    });
  }
};

/**
 * VERIFY NEW ACCOUNT ON 1ST TIME REGISTER API LOGIC
 * @param req :Request
 * @param res :Response
 */
const verifyNewAccount = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.NOT_FOUND).json({
      sucess: 1,
      message: ResponseMessages.USER_NOT_FOUND
    });
  }
  //Find user on the basis of id and update satus from verified : 'false' to > 'true'
  const user = await findByIdAndUpdateStatus(id)
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      sucess: 1,
      message: ResponseMessages.USER_NOT_FOUND
    });
  }
  try {
    await user.save();
    res.send(emailVerificationHTMLCode);
  } catch (e) {
    res.status(StatusCodes.SERVER_ERROR).json({
      sucess: 0,
      message: ResponseMessages.SOMETHING_WENT_WRONG
    });
  }
};

//Verify payment using stripe

// Create a payment endpoint
const verifyPayment = async (req, res) => {
  try {
    const { product, source, currency, buyerId } = req.body;
    var { amount } = req.body;
    amount = amount * 100;
    const charge = await stripe.charges.create({
      amount,
      source,
      currency,
      metadata: {
        buyerId,
        product: JSON.stringify(product),
      },
    });

    res.status(StatusCodes.SUCCESS).json({ message: 'Payment successful', charge });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(StatusCodes.SERVER_ERROR).json({
      success: 0,
      message: ResponseMessages.SOMETHING_WENT_WRONG
    });
  }
};

// Exporting Api Controllers
export { loginUser, registerUser, forgetPassword, verifyOTP, resetPassword, verifyNewAccount, verifyPayment };
