const Razorpay = require("razorpay");
const express = require("express");
const router = express.Router();
const paymentController=require('../controllers/paymentController')


// Create Order API
router.post(process.env.RAZORPAY_CREATE_ORDER,paymentController.paymentCreate);

module.exports = router;
