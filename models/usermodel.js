const mongoose=require('mongoose')
const bcrypt=require('bcrypt')

const userSchema= new mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:[true,'Fullname is required']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true

    },
    password:{  
        type:String,
        required:[true,'password is required']
    },
    phone:{
        type:String,
        required:true,
        valildate:{
            validator:function(v){
                return '/^\d{10}$/'.test(v);
            },
            message:(props)=>`${props.value} is not a valid phone number!`
        }
    },
    active:{
        type:Boolean,
        default:true
    },
    state: String,
    mandal: String,
    district: String,
    village: String,
    profilePic: String

})


userSchema.pre('save',async function(next){

    this.password = await bcrypt.hash(this.password,12);
    next();
})

userSchema.methods.comparePassword=async function(pwd,dbpwd){
    return await bcrypt.compare(pwd,dbpwd);
}

const User=mongoose.model('users',userSchema);



module.exports=User;