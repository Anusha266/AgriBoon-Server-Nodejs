const mongoose=require('mongoose')

const transactionSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products',
        required:true
    },
    isOTP_active:{
        type:Boolean,
        default:false,
    },
    sellerOTP:{
        type:String,
        default:'aaaa'
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    active:{
        type:Boolean,
        default:true
    },
    
})

const Transaction=mongoose.model('transactions',transactionSchema)

module.exports=Transaction;