const customError = require("../utils/customError");

const devErrors=(res,error)=>{
        res.status(error.statusCode).json({
                status:error.status,
                msg:error.message,
                stackTrace:error.stack,
                error:error

        });
        
}
const prodErrors=(res,error)=>{
        if(error.isOperational){
                res.status(error.statusCode).json({
                        status:error.status,
                        msg:error.message,
                });
        }
        else{
                res.status(404).json({
                        status:"error",
                        msg:"please try againn"
                })
        }
        

}
const castHandleError=(err)=>{
        return new customError(`Invalid Value ${err.value}  for field ${err.path}`,400);
        
}
module.exports=GlobalErrorHandler=(error,req,res,next)=>{
        //console.log(error);
        error.statusCode=error.statusCode || 500;
        error.status=error.status || "error";
        //console.log(process.env.MODE_ENV);
        if(process.env.NODE_ENV === 'development'){
                devErrors(res,error);
                
        }
        
        else if(process.env.NODE_ENV === 'production'){

                if(error.name ==='CastError'){
                       error=castHandleError(error);
                }
                else if(error.code===11000){
                        error=new customError(`user ${error.keyValue.email} already exists`,400);
                }
                else if(error.name==='TokenExpiredError'){
                        error=new customError("login time expired",400);
                }
                else if(error.name==='JsonWebTokenError'){
                        error=new customError("invalid token");
                }
                
                prodErrors(res,error);
        }
    
}