
const asyncErrorHandler=require('../utils/asyncErrorHandler');
const customError = require('../utils/customError');
const Transaction=require('../models/transactionModel')
const User = require('../models/usermodel'); 
const Product = require('../models/productModel'); 

const sendResponse=((res,statusCode,data)=>{
    
    res.status(statusCode).json({
        message:"success",
        data
    })
})
exports.getByProductStatus=asyncErrorHandler(async(req,res,next)=>{
        const {status}=req.params;
        
        const products=await Product.find({status});
        const productIds=products.map((product)=>product._id)
        const data=await Transaction.find({
            product:{$in:productIds},
            active:true
        })
        .populate('user')
        .populate({
            path:'product',
            populate:{
                path:'owner_details',
            },
        });
        

        sendResponse(res,200,data);

})

exports.createData=asyncErrorHandler(async(req,res,next)=>{

        const {product}=req.body;
        
        const user=req.user._id;

        const newData={user,product}
        console.log(newData)
        const data=await Transaction.create(newData)
        
        const populatedData = await Transaction.findById(data._id)
        .populate('user')  // Populate the 'user' field
        .populate({
            path:'product',
            populate:{
                path:'owner_details',
            },
        });  

        // Send the populated response
        sendResponse(res, 201, populatedData);

})

exports.getAll=asyncErrorHandler(async(req,res,next)=>{
    const data=await Transaction.find().populate('user').populate({
        path:'product',
        populate:{
            path:'owner_details',
        },
    });
    sendResponse(res,200,data)
})

exports.compareOTP=asyncErrorHandler(async(req,res,next)=>{
        //modify isOTP_active of Transaction model

    await Transaction.updateOne({id:req.body.id},{$set:{isOTP_active:true}})

    const data=await Transaction.findById(req.body.id)
    if(!data){
        return next(new customError("Requested transaction not found!",404))
    }
    const result=data.sellerOTP===req.body.otp;
    
    res.status(200).json({
        message:"success",
        data:{
            isEqual:result,
        }
    })

})


exports.update=asyncErrorHandler(async(req,res,next)=>{
    const {id}=req.params;
    console.log(id)
    const {...updateData } = req.body;

    // Ensure that updateData is not empty
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    // Perform the update operation with the dynamic update data
    const data = await Transaction.findByIdAndUpdate(
        id,
        { $set: updateData },  // Update any field passed in the body
        { new: true }
    );
    console.log(data)

    // Return the updated data as a response
    sendResponse(res, 200, data);
})

exports.get_data_by_product_details=asyncErrorHandler(async(req,res,next)=>{
        const {productId,createdOn}=req.body;

        const pid=await Product.findOne({_id:productId,createdOn})
        const data=await Transaction.findOne({product:pid._id})
        sendResponse(res,200,data)

})

exports.getTransactionById=asyncErrorHandler(async(req,res,next)=>{
    const {id}=req.params;
    const data=await Transaction.findById(id)

    sendResponse(res,200,data)
})

exports.getSellerData=asyncErrorHandler(async(req,res,next)=>{
    
      const {  ownerId, productId, status } = req.body;
    
      try {
        // Validate required fields
        if (!ownerId || !productId || !status) {
          return res.status(400).json({
            success: false,
            message: 'Please provide all required fields:ownerId, productId, and status.',
          });
        }
    
        // Fetch transaction data with populated user and product details
        const transactionData = await Transaction.find({
          'product': productId, // Ensure product ID matches
          active: true, // Optional: Only fetch active transactions
        })
          .populate({
            path: 'product',
            match: { owner_details: ownerId, status },
            populate:{
              path:'owner_details'
            } 
          })
          .populate({
            path: 'user',
          });
          console.log(transactionData)

    
          
    
        // Response with transaction data
        res.status(200).json({
          success: true,
          message: 'Seller transaction data fetched successfully.',
          data: transactionData,
        });
      } catch (error) {
        console.error('Error fetching seller transaction data:', error);
        res.status(500).json({
          success: false,
          message: 'An error occurred while fetching seller transaction data.',
          error: error.message,
        });
      }
    

})

exports.getBuyerData = asyncErrorHandler(async (req, res, next) => {
  const {  userId, productId, status } = req.body;
  console.log(req.body)

  try {
    // Validate required fields
    if (!userId || !productId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: userId, productId, and status.',
      });
    }

    // Fetch transaction data with populated product details
    const transactionData = await Transaction.find({
      user: userId, // Ensure user ID matches
      product: productId, // Ensure product ID matches
      active: true, // Optional: Only fetch active transactions
    })
      .populate({
        path: 'product',
        match: { status }, // Ensure status matches
        populate: {
          path: 'owner_details', 
          // Populate owner details inside the product
        },
      });
      console.log(transactionData)

    // Response with transaction data
    res.status(200).json({
      success: true,
      message: 'Buyer transaction data fetched successfully.',
      data: transactionData,
    });
  } catch (error) {
    console.error('Error fetching buyer transaction data:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching buyer transaction data.',
      error: error.message,
    });
  }
});

