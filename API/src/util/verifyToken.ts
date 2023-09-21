// Importing the express
import { Request, Response, NextFunction } from 'express';
// Importing jwt token package
import jwt from 'jsonwebtoken'
// Importing status and responce messages
import { StatusCodes } from '../config/statusCodes';
import ResponseMessages from '../config/messageCodes';

//Token from dotenv
const jwtSecretKey = process.env.JWT_TOKEN

/**
 * Function to handle the user authentication
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  // Getting the token from headers
  let token = req.headers.authorization;
  // If there is no token send responce
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: 0,
      message: ResponseMessages.UNAUTHORIZED
    });
  }
  try {
    // Verifying the given decrypt token
    const verifyToken = jwt.verify(token, jwtSecretKey ?? 'undefined');
    // Sotring the id req so we can acess on the next route
    req.body.id = verifyToken;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      sucess: 0,
      message: ResponseMessages.INVALID_DATA
    });
  }
};

export default verifyToken;