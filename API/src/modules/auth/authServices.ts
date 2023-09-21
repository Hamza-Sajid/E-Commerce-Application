// // Importing libraries
// import jwt from 'jsonwebtoken'
// import bcrypt from 'bcrypt'

// // Importing the DB Model
// import { userModel } from "../../models/User";

// /**
//  * Find user by the email in the database
//  * @param email 
//  * @returns 
//  */
// const getUserByEmail = async (email: string) => {
//     try {
//         return await userModel.findOne({ email: email });
//     } catch (error) {
//         throw error;
//     }
// }

// /**
//  * Generate a jwt token
//  * @param email 
//  * @returns 
//  */
// const generateToken = async (user: any) => {
//     try {
//         const JWT_TOKEN = process.env.JWT_TOKEN;
//         //Putting user id in pyaload so find user uniquely
//         const Payload = {
//             id: user._id,
//         };
//         return jwt.sign(Payload, JWT_TOKEN ?? 'Undefined', { expiresIn: '24h' });
//     } catch (error) {
//         throw error;
//     }
// }

// /**
//  * Find is the user already exists in the database or not
//  * On the basis of his email@ and phoneNumber#
//  * @param email 
//  * @param phone_number 
//  * @returns 
//  */

// const existingUser = async (email: String, phone_number: Number) => {
//     try {
//         // Checking if email already exists or not?
//         return await userModel.findOne({
//             $or: [{ email }, { phone_number }],
//         });
//     } catch (error) {
//         throw error;
//     }
// }

// /**
//  * Hashing the password usgin bcrypt
//  * @param password 
//  * @returns 
//  */
// const hashingPassword = async (password: any) => {
//     try {
//         const saltRounds = 10;
//         return await bcrypt.hash(password, saltRounds);
//     } catch (error) {
//         throw error;
//     }

// }

// /**
//  * Register / Signup user in the db [saving part]
//  * @param req 
//  * @param hashedPassword 
//  * @param unique_user_name 
//  * @returns 
//  */
// const registerUserInDb = async (req: any, hashedPassword: String, unique_user_name: String) => {
//     const { first_name, last_name, email, phone_number } = req.body;
//     try {

//         return await new userModel({
//             first_name: first_name,
//             last_name: last_name,
//             username: unique_user_name,
//             email: email,
//             password: hashedPassword,
//             phone_number: phone_number

//         });

//     } catch (error) {
//         throw error;
//     }
// }

// /**
//  * Find user the in database on the basis of email address
//  * @param email 
//  * @returns 
//  */
// const findUserInDb = async (email: String) => {
//     try {
//         return await userModel.findOne({ email: email });
//     } catch (error) {
//         throw error;
//     }


// }

// /**
//  * Find a user by the id and update his (is_Verified) status
//  * @param id 
//  * @returns 
//  */
// const findByIdAndUpdateStatus = async (id: String) => {
//     try {
//         return await userModel.findByIdAndUpdate(id, { is_verified: true });

//     } catch (error) {
//         throw error;
//     }
// }

// // Exporting all the functions
// export { getUserByEmail, generateToken, existingUser, hashingPassword, registerUserInDb, findUserInDb, findByIdAndUpdateStatus }


// Importing libraries
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Importing the DB Model
import { userModel } from "../../models/User";
import { generateRandomNumber, sendAcountVerificationEmail, sendRestPasswordEmail } from './authConstants';

/**
 * Un hashing the password
 * @param newPassword 
 * @param userPassword 
 * @returns 
 */
const unHashingPassword = async (newPassword: string, userPassword: string) => {
    try {
        return await bcrypt.compare(newPassword, userPassword);
    } catch (error) {
        throw error;
    }
}

/**
 * Find user by the email in the database
 * @param email 
 * @returns 
 */
const getUserByEmail = async (email: string) => {
    try {
        return await userModel.findOne({ email: email });
    } catch (error) {
        throw error;
    }
}

/**
 * Generate a jwt token
 * @param email 
 * @returns 
 */
const generateToken = async (user: any) => {
    try {
        const JWT_TOKEN = process.env.JWT_TOKEN;
        //Putting user id in pyaload so find user uniquely
        const Payload = {
            id: user._id,
        };
        return jwt.sign(Payload, JWT_TOKEN ?? 'Undefined', { expiresIn: '24h' });
    } catch (error) {
        throw error;
    }
}

/**
 * Find is the user already exists in the database or not
 * On the basis of his email@ and phoneNumber#
 * @param email 
 * @param phone_number 
 * @returns 
 */

const existingUser = async (email: String, phone_number: Number) => {
    try {
        // Checking if email already exists or not?
        return await userModel.findOne({
            $or: [{ email }, { phone_number }],
        });
    } catch (error) {
        throw error;
    }
}

/**
 * Hashing the password usgin bcrypt
 * @param password 
 * @returns 
 */
const hashingPassword = async (password: any) => {
    try {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        throw error;
    }

}

/**
 * Register / Signup user in the db [saving part]
 * @param req 
 * @param hashedPassword 
 * @param unique_user_name 
 * @returns 
 */
const registerUserInDb = async (req: any) => {
    const { first_name, last_name, email, password, phone_number } = req.body;
    // Generate a unique username based on first name and last name
    const unique_user_name = `${first_name.toLowerCase()}_${last_name.toLowerCase()}_${generateRandomNumber()}`;
    // Hashing the password
    const hashedPassword = await hashingPassword(password)
    try {

        const user = await new userModel({
            first_name: first_name,
            last_name: last_name,
            username: unique_user_name,
            email: email,
            password: hashedPassword,
            phone_number: phone_number

        });

        await user.save();
        if (user.email == undefined) {
            // to handle ts error
            user.email = 'undeinfed@gmal.com';
        }
        sendAcountVerificationEmail(user.email, user._id.toString());
        return true;
    } catch (error) {
        return false;
        throw error;

    }
}

/**
 * Find user the in database on the basis of email address
 * @param email 
 * @returns 
 */
const findUserInDb = async (email: String) => {
    try {
        return await userModel.findOne({ email: email });
    } catch (error) {
        throw error;
    }
}

/**
 * Find a user by the id and update his (is_Verified) status
 * @param id 
 * @returns 
 */
const findByIdAndUpdateStatus = async (id: String) => {
    try {
        return await userModel.findByIdAndUpdate(id, { is_verified: true });

    } catch (error) {
        throw error;
    }
}

const handleOtpProcess = async (user: any, otp: any) => {
    user.otp = {
        otp_code: otp,
        created_at: Math.round(new Date().getTime() / 1000),
        expire_at: Math.round(new Date().getTime() / 1000 + 1 * 60 * 25)
    };

    // Saving the user in database
    await user.save();
    // Calling reset password function with otp and email addrress as a paramter
    sendRestPasswordEmail(otp, user.email);

}

/**
 * Update the otp of user
 * @param user 
 * @param otp 
 * @param otpValidation 
 * @returns 
 */
const updateOtp = async (user: any, otp: any, otpValidation: any) => {

    if (user.otp?.otp_code == otp && otpValidation == true) {
        // Making change_pwd field as true so we can implement change pwd logic
        user.change_pwd = true;
        // Agin setting otp as null for security
        user.otp = undefined;

        // Saving the user in db
        await user.save();

        // Sending the responce
        return true
    }
    else return false
}

/**
 * Update password [using forget password api]
 * @param user 
 * @param password 
 * @returns 
 */
const updatePassword = async (user: any, password: string) => {

    if (user.change_pwd == true) {
        const hashedPassword = await hashingPassword(password)
        user.password = hashedPassword;
        user.change_pwd = false;
        await user.save();
        return true
    }
    else {
        return false
    }
}

// Exporting all the functions
export {
    getUserByEmail, generateToken, existingUser, hashingPassword,
    registerUserInDb, findUserInDb, findByIdAndUpdateStatus,
    unHashingPassword, handleOtpProcess, updateOtp, updatePassword,
}
