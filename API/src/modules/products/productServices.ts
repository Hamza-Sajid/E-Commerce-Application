// Importing the [PRODUCT] db model 
import ProductModel from "../../models/Product";

/**
 * Find a product by getting input from user
 * @param name 
 * @returns 
 */
const findProuctByName = async (name: String) => {
    try {
        return await ProductModel.findOne({ name: name });
    } catch (error) {
        throw error;
    }
}

/**
 * Add a new product into the database
 * @param req 
 * @param imgUrl 
 * @returns 
 */
const addNewProduct = async (req: any, imgUrl: String) => {
    try {
        // Getting all the input
        const { name, price, description, stock, category, variants, tags } = req.body;
        // Storing in the db
        return await new ProductModel({
            name,
            price,
            images: imgUrl,
            description,
            stock,
            category,
            variants,
            tags
        });
    } catch (error) {
        throw error;
    }
}

/**
 * Fetch all avilable product from the database
 * @param startIndex 
 * @param limit 
 * @returns 
 */
const getAllProductFromDb = async (startIndex: number, limit: number) => {
    try {
        return await ProductModel.find().skip(startIndex).limit(limit);
    } catch (error) {
        throw error;

    }
}

/**
 * Get a specific product from the _id
 * @param productId 
 * @returns 
 */
const getProductById = async (productId: String) => {
    try {
        return await ProductModel.findById(productId);
    } catch (error) {
        throw error;
    }
}

/**
 * Find a product and update it using the provided _id
 * @param req 
 * @param productId 
 * @returns 
 */
const findByIdAndUpdateProduct = async (req: any, productId: String) => {
    try {
        return await ProductModel.findByIdAndUpdate(
            productId,
            req.body,
            { new: true }
        );
    } catch (error) {
        throw error;
    }
}

/**
 * Find a product by _id and remove it from the database
 * @param productId 
 * @returns 
 */
const findByIdAndDeleteProduct = async (productId: String) => {
    try {
        return await ProductModel.findOneAndDelete({ _id: productId });
    } catch (error) {
        throw error;
    }
}

/**
 * Find a product on the basis of product name
 * @param name 
 * @returns 
 */
const findProductByName = async (name: any) => {
    try {
        return await ProductModel.find({ name: { $regex: name, $options: 'i' } });
    } catch (error) {
        throw error;
    }
}

/**
 * Get all availble categories in the system
 * @returns 
 */
const getAllCateogories = async () => {
    try {
        return await ProductModel.distinct('category');

    } catch (error) {
        throw error;
    }
}

/**
 * Find all product of a specific category
 * @param categoryName 
 * @returns 
 */
const findProductOfCategory = async (categoryName: any) => {
    try {
        return await ProductModel.find({ category: categoryName });

    } catch (error) {
        throw error;
    }
}

/**
 * Filter product on the basis of price (min OR max)
 * @param minPrice 
 * @param maxPrice 
 * @returns 
 */
interface ProductFilter {
    category: string;
    'price.value'?: { $gte?: number; $lte?: number };
}
const filterProduct = async (minPrice: number | undefined, maxPrice: number | undefined, category: string) => {
    const filter: ProductFilter = {
        category: category
    };
    if (minPrice !== undefined && maxPrice !== undefined) {
        filter['price.value'] = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice !== undefined) {
        filter['price.value'] = { $gte: minPrice };
    } else if (maxPrice !== undefined) {
        filter['price.value'] = { $lte: maxPrice };
    }
    try {

        return await ProductModel.find(filter);

    }
    catch (error) {
        throw error;
    };
}

/**
 * Find all availble product in a specific category
 * @param categoryName 
 * @returns 
 */
const findProductInCategory = async (categoryName: any) => {
    try {
        return await ProductModel.find({ category: categoryName });
    } catch (error) {
        throw error;
    };


}

// Exporting all the functions
export {
    findProuctByName, addNewProduct, getAllProductFromDb, getProductById,
    findByIdAndUpdateProduct, findByIdAndDeleteProduct, findProductByName, getAllCateogories,
    findProductOfCategory, filterProduct, findProductInCategory
};