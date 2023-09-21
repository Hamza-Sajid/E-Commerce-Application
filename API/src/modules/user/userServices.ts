// productServices.ts
import { Request, Response } from 'express';
import ProductModel from '../../models/Product';

// Add a comment/review to a product
const postCommentService = async (
    productId: string,
    rating: number,
    title: string,
    description: string,
    createdByUser: string
) => {
    try {
        const product = await ProductModel.findById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        // Update star ratings based on the new rating
        if (rating >= 1 && rating <= 5) {
            product.starRatings[rating - 1] += 1; // Update the star rating count
        }

        // Add the review to the product's review array
        product.review.push({
            rating,
            title,
            description,
            createdByUser,
        });
        product.totallReviews += 1;

        // Calculate averageRating based on updated star ratings
        const totalStars = product.starRatings.reduce(
            (total, count, index) => total + count * (index + 1),
            0
        );
        product.averageRating = totalStars / product.totallReviews;

        await product.save();

        return 'Review added successfully';
    } catch (error) {
        throw new Error('An error occurred');
    }
};

// Get comments/reviews for a product
const getCommentsService = async (productId: string) => {
    try {
        const product = await ProductModel.findById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        // Return the comments/reviews for the product
        return product.review;
    } catch (error) {
        throw new Error('An error occurred');
    }
};

// Get star ratings for a product
const getStarRatingService = async (productId: string) => {
    try {
        const product = await ProductModel.findById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        // Return the star ratings for the product
        return product.starRatings;
    } catch (error) {
        throw new Error('An error occurred');
    }
};

export { postCommentService, getCommentsService, getStarRatingService };
