
const Product=require('../models/productModel')
const User=require('../models/usermodel')
const asyncErrorHandler=require('../utils/asyncErrorHandler');
const customError = require('../utils/customError');


const sendResponse=asyncErrorHandler((res,statusCode,data)=>{

    res.status(statusCode).json({
        message: "success",
        count:data && data.length || null,
        data,
    })

})
exports.upload=asyncErrorHandler(async(req,res,next)=>{
    console.log(req.file)

        if (!req.file) {
            return next(new customError('No file uploaded.',400));
        }
        const { name, quality, min_price, max_price} = req.body;
        const image = req.file ? `${process.env.ROOT}/uploads/${req.file.filename}` : null; // Image file path


        const total=await productCount();
        console.log(total);

        const newData = new Product({
            id:total+1,
            name,
            quality,
            min_price,
            max_price,
            image, // Store the image path in the DB
            owner_details:req.user._id, // The logged-in user's ID
        });
        
       
        const product= await Product.create(newData);
        const populatedProduct = await Product.findById(product._id).populate('owner_details')
        sendResponse(res,201,populatedProduct)
        
})



exports.fetch_all=asyncErrorHandler(async(req,res,next)=>{
    const products=await Product.find({status:'initial'}).populate('owner_details');
    sendResponse(res,200,products)

})

exports.getByName=asyncErrorHandler(async(req,res,next)=>{
    const productName=req.query.name;
    if (!productName) {
        return next(new customError("productName is required"),400);
    }
    const products=await Product.find({name:productName,status:"initial"})
    sendResponse(res,200,products);
})

exports.getProductById=asyncErrorHandler((async(req,res,next)=>{
        const product=await Product.find({id:req.params.id}).populate('owner_details')
        sendResponse(res,200,product)
}))

exports.deleteProduct=asyncErrorHandler(async(req,res,next)=>{
    const user=await Product.find({id:req.params.id})
    if(user.length==0){
        return next(new customError("User does not exists.",404))
    }
    await Product.updateOne({active:false})
    sendResponse(res,204,null)
})
exports.updateProduct=asyncErrorHandler(async(req,res,next)=>{
    const updates=req.body;
    const id=req.params.id;
    if (Object.keys(updates).length==0){
        return next(new customError("No data found for updating"))
    }
    const result = await Product.updateOne({ _id:id }, { $set: updates });
    if (result.matchedCount === 0) {
        return next(new customError("product not found!",404))
    }
    const user=await Product.findOne({_id:id}).populate('owner_details')
    sendResponse(res,200,user)
      
})

const productCount=async function(){
    try {
        const count = await Product.countDocuments()
        return count
    } catch (error) {
        return 0
    }
}

exports.getCardProducts=asyncErrorHandler(async(req,res,next)=>{
    const data=await Product.find({cart:true})
    sendResponse(res,200,data)
})