// Importing express  and relevent libraries
import { Request, Response } from 'express';
import { Types } from 'mongoose';

// Importing http status codes and messages
import ResponseMessages from '../../config/messageCodes';
import { StatusCodes } from '../../config/statusCodes';

// Importing cloudnary file
import handleImageUpload from '../../util/cloundnaryImageUpload';
import { addNewProduct, filterProduct, findByIdAndDeleteProduct, findByIdAndUpdateProduct, findProductByName, findProductInCategory, findProductOfCategory, findProuctByName, getAllCateogories, getAllProductFromDb, getProductById } from './productServices';
import ProductModel from '../../models/Product';


/**
 * Add a new product to the database
 * @param req
 * @param res
 * @returns
 */
const addProduct = async (req: any, res: Response) => {
  try {

    if (req.files == undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: 0,
        message: ResponseMessages.INVALID_DATA
      });
    }
    // Getting all input from the user 
    const { name, price, description, stock, category, variants, tags } = req.body;

    if (!name || !description || !stock || !category || !tags) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: 0,
        message: ResponseMessages.INVALID_DATA
      });
    }

    /**
     * Check if product name already exists in the system else continue--
     * ABORT DUPLICATE PRODUCT NAME QUERY
     */
    const allProducts = await findProuctByName(name);
    if (allProducts != null) {
      return res.status(StatusCodes.ALREADY_EXSISTS).json({
        success: 0,
        message: ResponseMessages.ALREADY_EXSISTS,
      })
    }

    // Uploading images on cloud
    const imgUrl = await handleImageUpload(req);

    // To store the product in the db
    const product = await addNewProduct(req, imgUrl)
    product.save();

    return res.status(StatusCodes.SUCCESS).json({
      sucess: 1,
      message: ResponseMessages.ADD_TO_DB,
      data: product
    });
  }

  catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      success: 0,
      message: ResponseMessages.SOMETHING_WENT_WRONG
    });
  }

};

/**
 * Get all the stored product from the database
 * @param req 
 * @param res 
 * @returns 
 */
const getAllProducts = async (req: Request, res: Response) => {
  // Pagination implementation
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = 10;
  const startIndex = (page - 1) * limit;

  try {
    // Get all product from the DB
    const products = await getAllProductFromDb(startIndex, limit)

    if (!products || products.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: 0,
        message: ResponseMessages.NOT_FOUND,
      });
    }

    return res.status(StatusCodes.SUCCESS).json({
      success: 1,
      message: ResponseMessages.FOUND,
      data: products,
    });
  } catch (error) {
    res.status(StatusCodes.SERVER_ERROR).json({
      success: 0,
      message: ResponseMessages.SOMETHING_WENT_WRONG,
    });
  }
};

/**
 * Find a product by the  id given from the user
 * @param req 
 * @param res 
 * @returns 
 */
const findProduct = async (req: Request, res: Response) => {
  try {
    // Getting the product id from params
    const { productId } = req.params;

    if (!Types.ObjectId.isValid(productId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: 0,
        message: ResponseMessages.INVALID_ID,
      });
    }

    // Searching for the product in the id against the user provided id
    const product = await getProductById(productId)

    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: 0,
        message: ResponseMessages.PRODUCT_NO_EXISTS,
      });
    }
    // On sucess we are returning this data
    return res.status(StatusCodes.SUCCESS).json({
      success: 1,
      message: ResponseMessages.FOUND,
      data: product,
    });
  }

  catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      success: 0,
      message: ResponseMessages.SOMETHING_WENT_WRONG
    });
  }
};

/**
 * Update a product by the user given id
 * @param req 
 * @param res 
 * @returns 
 */
const updateProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  if (!productId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: 0,
      message: ResponseMessages.INVALID_DATA
    });
  }

  try {
    // Find product by id and udpate using given field 
    const updatedProduct = await findByIdAndUpdateProduct(req, productId)

    if (!updatedProduct) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: 0,
        message: ResponseMessages.PRODUCT_NO_EXISTS
      });
    }

    return res.status(StatusCodes.SUCCESS).json({
      success: 1,
      message: ResponseMessages.UPDATED,
      data: updatedProduct
    });

  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      success: 0,
      message: ResponseMessages.SOMETHING_WENT_WRONG
    });
  }

}

/**
 * Delete a product by the given id
 * @param req 
 * @param res 
 * @returns 
 */
const deleteProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  if (!productId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: 0,
      message: ResponseMessages.ENTERID
    });
  }
  try {
    // Find and delete the product by productId
    const deletedProduct = await findByIdAndDeleteProduct(productId)

    if (!deletedProduct) {
      return res.status(StatusCodes.NOT_FOUND).json({
        sucess: 0,
        message: ResponseMessages.NOT_FOUND
      });
    }

    return res.status(StatusCodes.SUCCESS).json({
      success: 1,
      message: ResponseMessages.DELETED,
      data: deleteProduct
    });
  }

  catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      success: 0,
      message: ResponseMessages.SOMETHING_WENT_WRONG
    });
  }
};

/**
 * Search a product by the name from the db
 * @param req 
 * @param res 
 * @returns 
 */
const searchProductWithQuery = async (req: Request, res: Response) => {
  const { name } = req.query;

  if (!name) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: 0,
      message: ResponseMessages.QUERY
    });
  }
  try {
    // Finding  a specific product from product db with regeex to handle capital and small cases
    const queryResponce = await findProductByName(name)
    if (queryResponce == null) {
      return res.status(StatusCodes.NOT_FOUND).json({
        sucess: 0,
        message: ResponseMessages.PRODUCT_NO_EXISTS
      });
    }

    return res.status(StatusCodes.SUCCESS).json({
      success: 1,
      message: ResponseMessages.FOUND,
      data: queryResponce
    });
  }

  catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      success: 0,
      message: ResponseMessages.SOMETHING_WENT_WRONG
    });
  }
};

/**
 * Get all categories present in the product database
 * @param req 
 * @param res 
 * @returns 
 */
const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCateogories();
    if (!categories) {
      return res.status(StatusCodes.NOT_FOUND).json({
        sucess: 0,
        message: ResponseMessages.NOT_FOUND
      });
    }
    return res.status(StatusCodes.SUCCESS).json({
      success: 1,
      message: ResponseMessages.EXSISTS,
      data: categories
    });
  }
  catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      success: 0,
      message: ResponseMessages.SOMETHING_WENT_WRONG
    });
  }
};


/**
 * Product categorization :  Products by category 
 * @param req 
 * @param res 
 * @returns 
 */
const productByCategory = async (req: Request, res: Response) => {
  const { categoryName } = req.params;
  if (!categoryName) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: 0,
      message: ResponseMessages.QUERY
    });
  }
  try {
    // Get all product of a specific category
    const filteredProducts = await findProductOfCategory(categoryName)
    res.status(StatusCodes.SUCCESS).json({
      success: 1,
      data: filteredProducts
    });
  } catch (error) {
    res.status(StatusCodes.SERVER_ERROR).json({
      success: 0,
      message: ResponseMessages.SOMETHING_WENT_WRONG
    });
  }
};


/**
 * Product Filteration ~ [ Filter an product by various attributes (e.g price_range)]
 * @param req 
 * @param res 
 * @returns 
 */

const filterProducts = async (req: Request, res: Response) => {

  const { category, minPrice, maxPrice } = req.query;


  // If condition to filter product on the basis of min and max price
  if (minPrice || maxPrice) {
    try {

      const filteredProducts = await filterProduct(Number(minPrice), Number(maxPrice), String(category));
      console.log(filteredProducts)
      res.status(StatusCodes.SUCCESS).json({
        success: 1,
        message: ResponseMessages.FOUND,
        data: filteredProducts
      });
    } catch (error) {
      res.status(StatusCodes.SERVER_ERROR).json({
        success: 0,
        message: ResponseMessages.SOMETHING_WENT_WRONG
      });
    }
  }
  // Else to continue filtering user on the basis of category
  else {
    const { category } = req.query;
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: 0,
        message: ResponseMessages.QUERY
      });
    }
    try {

      const filteredProducts = await findProductOfCategory(category)
      res.status(StatusCodes.SUCCESS).json({
        success: 1,
        message: ResponseMessages.FOUND,
        data: filteredProducts
      });
    } catch (error) {
      res.status(StatusCodes.SERVER_ERROR).json({
        success: 0,
        message: ResponseMessages.SOMETHING_WENT_WRONG
      });
    }
  }
};

const getProductFromSpecificCategory = async (req: Request, res: Response) => {
  const { categoryName } = req.query;
  if (!categoryName) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      sucess: 0,
      message: ResponseMessages.UNAUTHORIZED
    });
  }
  try {
    const products = await findProductInCategory(categoryName);
    if (!products) {
      return res.status(StatusCodes.NOT_FOUND).json({
        sucess: 0,
        message: ResponseMessages.NOT_FOUND
      });
    }

    res.status(StatusCodes.SUCCESS).json({
      success: 1,
      error: ResponseMessages.FOUND,
      data: products
    });

  } catch (error) {
    res.status(StatusCodes.SERVER_ERROR).json({
      success: 0,
      message: ResponseMessages.SOMETHING_WENT_WRONG
    });

  }

};
/**
 *  Get trending product on home page
 * @param req 
 * @param res 
 */
const getTrendingProducts = async (req: Request, res: Response) => {
  try {
    // Find products with rating >= 4 and sort by rating in descending order
    const trendingProducts = await ProductModel.find({
      'averageRating': { $gte: 4 }, // Rating >= 4
    })
      .sort({ 'review.rating': -1 }) // Sort by rating in descending order
      .limit(4); // Get top 4 trending products

    res.status(StatusCodes.SUCCESS).json({
      succes: 1,
      trendingProducts
    });
  } catch (error) {
    res.status(StatusCodes.SERVER_ERROR).json({
      success: 0,
      message: ResponseMessages.SOMETHING_WENT_WRONG
    });
  }

}
// Exporting all the functions

export {
  addProduct, getAllProducts, findProduct, updateProduct, deleteProduct, searchProductWithQuery,
  getCategories, productByCategory, filterProducts, getProductFromSpecificCategory,
  getTrendingProducts
};