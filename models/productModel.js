const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: Number, 
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
    },
    quality: {
        type: String,
        required: [true, 'Product quality is required'],
    },
    min_price: {
        type: Number,
        required: [true, 'Minimum price is required'],
    },
    max_price: {
        type: Number,
        required: [true, 'Maximum price is required'],
    },
    status: {
        type: String,
        default: 'initial',
    },
    image: {
        type: String,
        required: [true, 'Product image is required'],
    },
    uploaded_on: {
        type: Date,
        default: Date.now, // Default to today's date
    },
    owner_details: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Reference to the User model
        required: true,
    },
    active:{
        type:Boolean,
        default:true
    },
    cart:{
        type:Boolean,
        default:false
    },
    createdOn:{
        type:Date,
        default:Date.now,
    },
});


// Create the Product model
const Product = mongoose.model('products', productSchema);

module.exports = Product;
