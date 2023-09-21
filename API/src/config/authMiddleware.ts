// Importing the express
import { Request, Response, NextFunction } from 'express';
// Importing jwt token package
import jwt from 'jsonwebtoken';
// Importing status and responce messages
import { StatusCodes } from './statusCodes';
import ResponseMessages from './messageCodes';

const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Getting the token from headers
  let token = req.headers.authorization;

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: 0,
      message: ResponseMessages.INVALID_DATA
    });
  }
  // Spliting only the token and avoiding the `bearer` string
  token = token.split(' ')[1];

  token = token[1];
  // If there is no token send responce
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: 0,
      message: ResponseMessages.UNAUTHORIZED
    });
  }
  try {
    // Verifying the given decrypt token
    const verifyToken = jwt.verify(token, process.env.JWTTOKEN ?? 'undefined');
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

export default AuthMiddleware;