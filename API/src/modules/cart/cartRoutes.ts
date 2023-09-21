// Importing express
import express from 'express';
// Importing the controllers
import { addToCart, emptyCart, getCartProducts, removeCartProduct } from './cartController';

const cartRoutes = express.Router();

cartRoutes.post("", addToCart)
cartRoutes.get("/:userId", getCartProducts)
cartRoutes.delete('/:userId/remove/:productId', removeCartProduct);
cartRoutes.delete("/user/:userId", emptyCart)


export default cartRoutes;