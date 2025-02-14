const Razorpay = require("razorpay");
const express = require("express");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const router = express.Router();


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order API
exports.paymentCreate=asyncErrorHandler(async (req, res) => {
    const { amount, transactionId } = req.body;

    const options = {
      amount: amount, 
      currency: "INR",
      receipt: `receipt_${transactionId}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(201).json({
      message:"success",
      data:order
    })

});

