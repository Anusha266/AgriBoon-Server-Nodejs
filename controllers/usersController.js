const User=require('../models/usermodel')
const asyncErrorHandler=require('../utils/asyncErrorHandler');
const customError = require('../utils/customError');

const sendResponse=asyncErrorHandler((res,statusCode,data)=>{

    res.status(statusCode).json({
        message: "success",
        count:data.length,
        data,
    })

})

exports.getAll=asyncErrorHandler(async(req,res,next)=>{

        const users=await User.find();
        sendResponse(res,200,users)


})

exports.getUserCount=async function(){
    try {
        const userCount = await User.countDocuments()
        return userCount
    } catch (error) {
        return 0
    }
}

exports.getUserByID=asyncErrorHandler(async(req,res,next)=>{
    const user=await User.find({id:req.params.id})
    sendResponse(res,200,user)
})

exports.getCurrentUser=asyncErrorHandler(async(req,res,next)=>{
    sendResponse(res,200,req.user)
})

exports.createProfile=asyncErrorHandler(async(req,res,next)=>{
    const {name,email,password,phone}=req.user;
    const { state, mandal, district, village, address } = req.body;

    let profilePic = null;
    if (req.file) {
        profilePic = req.file.path; // Save the file path to the database
    }
    const updatedProfile = await User.findByIdAndUpdate(
        req.user._id, // Use the user ID to find and update the profile
        {
          $set: {
            state,
            mandal,
            district,
            village,
            profilePic, 
          },
        },
        { new: true } 
      );
    if (!updatedProfile){
        return next(new customError("profile not updated",404))
    }
    sendResponse(res,200,updatedProfile);

})

