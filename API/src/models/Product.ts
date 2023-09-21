// Importing the mongose
import mongoose from 'mongoose';

// Defineing the price schema
const PriceSchema = new mongoose.Schema({
    value: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true
    },
    discountPercentage: {
        type: Number,
    },
    disountedPrice: {
        type: Number,
    }
});

const VariantSchema = new mongoose.Schema({
    variantName: {
        type: String,
    },
    value: {
        type: String,
    },
    price: {
        value: {
            type: Number,
        },
        currency: {
            type: String,
        }
    }
});
// To store the user reviews and rating
const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,

    },
    title: {
        type: String
    },
    description: {
        type: String,
    },
    createdByUser: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// ----  MAIN PRODUCT SCHEMA -----
const productSchema = new mongoose.Schema({
    // Product name
    name: {
        type: String,
        required: true,
    },
    //  Product price
    price: PriceSchema,
    // To store an image
    images: [String],
    // Product description
    description: {
        type: String,
    },
    // Sotck schema
    stock: {
        type: Number,
        required: true
    },
    // Category schmea
    category: {
        type: [String],
    },
    // Review schema
    review: [ReviewSchema],
    totallReviews: {
        type: Number,
        default: 0
    },
    // Product variant schema
    variants: [VariantSchema],
    // Product creation date
    createdAt: {
        type: Date,
        default: Date.now,
    },
    averageRating: {
        type: Number,
        default: 0
    },
    starRatings: {
        type: [Number],
        default: [0, 0, 0, 0, 0], // Initialize with 5 zeros for 5 stars
    },
    tags: {
        type: [String],
        required: true
    }
});

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;