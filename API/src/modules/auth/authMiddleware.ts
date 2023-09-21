// Importing express package
import { Request, Response, NextFunction } from 'express';
// Importing the express validator
import { body, validationResult } from 'express-validator';
// Importing the http status codes
import { StatusCodes } from '../../config/statusCodes';

/**
 * VALIDATE EMAI FOR RESET PASSWORD API
 */
const validateEmail = [
  // Validate email
  body('email').isEmail().withMessage('Invalid email format'),
  // Check for validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
  },
];

/**
 * LOGIN API MIDDLEWARE
 */
const validateLoginUser = [
  // Validate email
  body('email').isEmail().withMessage('Invalid email format'),

  // Validate password
  body('password').notEmpty().withMessage('Password is required'),

  // Check for validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
  },
];





/**
 * ENTER NEW PASSWORD API MIDDLEWARE
 */
const validateNewPassword = [
  // Validate password
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 5 }).withMessage('Password should be at least 5 characters long')
    .matches(/\d/).withMessage('Password should contain at least one digit')
    .matches(/[a-zA-Z]/).withMessage('Password should contain at least one letter'),
  // Check for validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
  },
];

/**
 * REGISTER USER MIDDLEWARE API
 */
const validateRegisterUser = [
  // Validate first_name
  body('first_name').notEmpty().withMessage('First name is required'),

  // Validate last_name
  body('last_name').notEmpty().withMessage('Last name is required'),
  // Validate email
  body('email').isEmail().withMessage('Invalid email format'),
  // Validate password
  body('password').notEmpty().withMessage('Password is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 5 }).withMessage('Password should be at least 5 characters long')
    .matches(/\d/).withMessage('Password should contain at least one digit')
    .matches(/[a-zA-Z]/).withMessage('Password should contain at least one letter'),
  // Validate phone_number (unique)
  body('phone_number')
    .notEmpty()
    .withMessage('Phone number is required'),
  // Check for validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
  },
];

export { validateEmail, validateLoginUser, validateRegisterUser, validateNewPassword };