// Importing express
import express from 'express';
// Importing the auth user middleware
import verifyToken from '../../util/verifyToken';
// Importing relevent controllres
import { addProduct, deleteProduct, filterProducts, findProduct, getAllProducts, getCategories, getTrendingProducts, productByCategory, searchProductWithQuery, updateProduct } from './productController';
// Importing multer config file
import upload from '../../config/multerConfig';

const productRoutes = express.Router();

// Tredning Product
productRoutes.get("/trending", getTrendingProducts)


// Product categorization API
productRoutes.get("/categories", verifyToken, getCategories);
productRoutes.get("/categories/:categoryName", verifyToken, productByCategory)

// Search and filter API
productRoutes.get("/search", searchProductWithQuery);
productRoutes.get("/filter", verifyToken, filterProducts);

// CRUD APIS
productRoutes.post('', upload.array('images'), addProduct);
productRoutes.get('', getAllProducts);
productRoutes.get('/:productId', verifyToken, findProduct);
productRoutes.patch('/:productId', verifyToken, updateProduct);
productRoutes.delete('/:productId', verifyToken, deleteProduct);




export default productRoutes;