const User=require('../models/usermodel')
const asyncErrorHandler=require('../utils/asyncErrorHandler');
const customError = require('../utils/customError');
const jwt=require('jsonwebtoken');
const util=require('util');
const userController=require('./usersController')

const signToken=(id)=>{
    return jwt.sign({id:id},process.env.SECRET_STR_JWT,
        {
            expiresIn:process.env.LOGIN_EXPIRES
        }
    )
}
const CreateSendResponse=((res,user,statusCode)=>{

    const token=signToken(user._id);
    const options= {

        maxAge: process.env.LOGIN_EXPIRES,
        httpOnly:true,
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure=true;
    }

    res.status(statusCode).json({
        message:"success",
        token,
        data:{
                user
            },

    })
})

exports.signup=asyncErrorHandler(async(req,res,next)=>{
    var data=req.body;

    const userCount=await userController.getUserCount();
    data={...data,id:userCount+1}
    const user=await User.create(data);
    CreateSendResponse(res,user,201);


})

exports.login=asyncErrorHandler(async(req,res,next)=>{
    console.log("entered into login...............")

    const {email,password}=req.body;
    if(!email || !password){
        
        const error=new customError("please provide email and password for login",400);
        return next(error);
    }
    const user=await User.findOne({ email }).select('+password');
    if(!user){
            const error=new customError("No user exists");
            return next(error);
    }
    const isMatch=await user.comparePassword(password,user.password);

    if(!isMatch){
            const error=new customError("Incorrect password");
            return next(error);
    }
    console.log(user)

    CreateSendResponse(res,user,200);

})

exports.protect = asyncErrorHandler(async(req,res,next)=>{

    const testToken=req.headers.authorization;
    if(testToken || testToken.startsWith('Bearer')){
        token=testToken.split(' ')[1];
    }

    if(!token){
        return next(new customError("you are not logged in"));
    }

    const decodedToken= await util.promisify(jwt.verify)(token,process.env.SECRET_STR_JWT);

    const user=await User.findById(decodedToken.id);
    if(!user){
        const error=new customError(`user not exists with this id::${decodedToken.id}`,401);
        next(error);
    }
    req.user=user;
    next();
})
