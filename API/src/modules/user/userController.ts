// Importing express and relvent packages
import { Request, Response } from 'express';
import logger from '../../util/debugger';

// Importing models
import { userModel } from '../../models/User';
import ProductModel from '../../models/Product';
// Importing HTTP staus code
import { StatusCodes } from '../../config/statusCodes';
// Importing HTTP responce messages
import ResponseMessages from '../../config/messageCodes';
// Importing the services 
import { getCommentsService, getStarRatingService, postCommentService } from './userServices';


// Define a custom interface that extends Request
interface CustomRequest extends Request {
  id?: string; // Add any other properties you may use in your middleware
}

/**
 * Get user profile on login
 * @param req
 * @param res
 */
const getUser = async (req: CustomRequest, res: Response) => {
  // To get the value of id from middleware
  const { id } = req.body.id;
  // If there is no id return 408 msg
  if (!id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: ResponseMessages.INVALID_CREDENTIALS });
  }
  try {
    // Finding user from the token decrypt id
    const user = await userModel.findOne({ _id: id });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: ResponseMessages.USER_NOT_FOUND });
    }
    return res.status(StatusCodes.SUCCESS).json(user);

  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({ message: ResponseMessages.SOMETHING_WENT_WRONG });
  }
};

/**
 * Post a comment on a product
 * @param req 
 * @param res 
 */
const postComment = async (req: Request, res: Response) => {
  const { productId, rating, title, description, createdByUser } = req.body;

  try {
    const message = await postCommentService(
      productId,
      rating,
      title,
      description,
      createdByUser
    );
    res.status(StatusCodes.SUCCESS).json({
      success: 1,
      message
    });
  } catch (error) {
    logger.error('Error adding review:', error)
    res.status(StatusCodes.SERVER_ERROR).json({
      success: 0,
      error: ResponseMessages.SOMETHING_WENT_WRONG
    });
  }
};

/**
 * Get all comment on a product
 * @param req 
 * @param res 
 */
const getComments = async (req: Request, res: Response) => {
  const { productId } = req.params;

  try {
    const comments = await getCommentsService(productId);
    res.status(StatusCodes.SUCCESS).json(comments);
  } catch (error) {
    res.status(StatusCodes.SERVER_ERROR).json({
      success: 0,
      error: ResponseMessages.SOMETHING_WENT_WRONG
    });

  }
};

/**
 * Function to get star rating [1-5] indivisually
 * @param req 
 * @param res 
 */
const getStarRating = async (req: Request, res: Response) => {
  const { productId } = req.params;

  try {
    const starRatings = await getStarRatingService(productId);
    res.status(StatusCodes.SUCCESS).json(starRatings);
  } catch (error) {
    res.status(StatusCodes.SERVER_ERROR).json({
      success: 0,
      error: ResponseMessages.SOMETHING_WENT_WRONG
    });
  }
};



export { getUser, postComment, getComments, getStarRating };