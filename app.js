const express=require('express')
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'})
const cors=require('cors')
const path = require('path');
const multer=require('multer')

const transactionRoute=require('./routes/transactionRoutes')
const productRoute=require('./routes/productsRoute')
const userRoute=require('./routes/usersRoutes')
const authRouter=require('./routes/authRoutes')
const paymentRoute=require('./routes/paymentRoutes')


const GlobalErrorHandler=require('./controllers/errorController');
const customError = require('./utils/customError')

//initialization
const app=express()

app.use(cors({
    origin:['https://merry-salmiakki-57b7ff.netlify.app','http://localhost:5173'],
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
    
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(express.json()); //to use request body


//Routes

app.get('/',(req,res)=>{
    res.send("Welcome to AgriBoon");
})


// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,'/uploads'));
  },
  filename: (req, file, cb) => {
    // Generate a unique name for the file using timestamp
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName); // Save file with the generated name
  }
});

const upload = multer({ storage});


app.use(process.env.AUTH_ROUTE,authRouter);
app.use(process.env.USER_ROUTE,upload.single('profilePic'),userRoute);
app.use(process.env.TRANSACTION_ROUTE,transactionRoute);
app.use(process.env.RAZORPAY_PAYMENT_ROUTE,paymentRoute);
app.use(process.env.PRODUCTS_ROUTE,upload.single('image'),productRoute)






app.use("*",(req,res,next)=>{
    return next(new customError(`can't find this url:${req.originalUrl}`,404));
})

app.use(GlobalErrorHandler);

module.exports=app;