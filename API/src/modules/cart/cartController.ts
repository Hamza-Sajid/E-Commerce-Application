import { Request, Response } from 'express';
import {
    addToCartService,
    getCartProductsService,
    removeCartProductService,
    emptyCartService,
} from './cartServices';
import { StatusCodes } from '../../config/statusCodes';
import ResponseMessages from '../../config/messageCodes';

/**
 * Add a product to the cart
 * @param req 
 * @param res 
 */
const addToCart = async (req: Request, res: Response) => {
    const { userId, productId, quantity } = req.body;
    try {
        const message = await addToCartService(userId, productId, quantity);
        res.status(StatusCodes.SUCCESS).json({
            success: 1,
            message: ResponseMessages.ADD_TO_DB
        });
    } catch (error) {
        res.status(StatusCodes.SERVER_ERROR).json({
            success: 0,
            error: ResponseMessages.SOMETHING_WENT_WRONG
        });
    }
};

/**
 * Get all cart items list
 * @param req 
 * @param res 
 */
const getCartProducts = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const cart = await getCartProductsService(userId);
        res.status(StatusCodes.SUCCESS).json({
            success: 1,
            cart
        });
    } catch (error) {
        res.status(StatusCodes.SERVER_ERROR).json({
            success: 0,
            message: ResponseMessages.SOMETHING_WENT_WRONG
        });
    }
};


/**
 * Remove items from the cart
 * @param req 
 * @param res 
 */
const removeCartProduct = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const productId = req.params.productId;
    try {
        const message = await removeCartProductService(userId, productId);
        res.status(StatusCodes.SUCCESS).json({
            success: 1,
            message
        });
    } catch (error) {
        res.status(StatusCodes.SERVER_ERROR).json({
            success: 0,
            message: ResponseMessages.SOMETHING_WENT_WRONG
        });
    }
};

/**
 * Delete all items from the cart , [will be used when we are making checkout]
 * @param req 
 * @param res 
 */
const emptyCart = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const message = await emptyCartService(userId);
        res.status(StatusCodes.SUCCESS).json({
            success: 1,
            message
        });
    } catch (error) {
        res.status(StatusCodes.SERVER_ERROR).json({
            success: 0,
            message: ResponseMessages.SOMETHING_WENT_WRONG
        });
    }
};


// Exporting all the funnctions
export { addToCart, getCartProducts, removeCartProduct, emptyCart };
