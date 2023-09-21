import { cartModel, userModel } from '../../models/User';
import ProductModel from '../../models/Product';
import mongoose from 'mongoose';

/**
 * Add a item to user cart
 * @param userId 
 * @param productId 
 * @param quantity 
 * @returns 
 */
const addToCartService = async (userId: string, productId: string, quantity: number) => {
    try {
        let user = await userModel.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        let cart = await cartModel.findOne({ user: user.cart });

        if (!cart) {
            cart = new cartModel({ user: user._id, products: [] });
        }

        const existingProduct = cart.products.find((p) => p.product.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            const productObjectId = new mongoose.Types.ObjectId(productId);
            cart.products.push({ product: productObjectId, quantity: quantity });
        }

        await cart.save();
        return 'Product added to cart';
    } catch (error) {
        throw new Error('Failed to add product to cart');
    }
};

/**
 * Get products which are avialable in the cart
 * @param userId 
 * @returns 
 */
const getCartProductsService = async (userId: string) => {
    try {
        const cart = await cartModel.find({ user: userId }).populate('products.product');
        return cart;
    } catch (error) {
        throw new Error('Failed to fetch cart items');
    }
};

/**
 * Remove all items from the cart , upon successfull payment checkout
 * @param userId 
 * @param productId 
 * @returns 
 */
const removeCartProductService = async (userId: string, productId: string) => {
    try {
        const cart = await cartModel.findOneAndDelete({ user: userId, _id: productId });
        if (!cart) {
            throw new Error('Cart not found');
        }
        return 'Product removed from cart';
    } catch (error) {
        throw new Error('Failed to remove product from cart');
    }
};

const emptyCartService = async (userId: string) => {
    try {
        const deleteResult = await cartModel.deleteMany({ user: userId });

        if (deleteResult.deletedCount === 0) {
            throw new Error('Carts not found');
        }

        return 'Carts deleted successfully';
    } catch (error) {
        throw new Error('An error occurred during checkout');
    }
};

// Exporting all the functions
export { addToCartService, getCartProductsService, removeCartProductService, emptyCartService };
