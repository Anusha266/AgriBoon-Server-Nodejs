const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const mongoose=require('mongoose');

const app=require('./app');

//server initialization
const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{
    console.log("server started successfully on port:"+PORT)
})

//database connection

mongoose.connect(process.env.MONGODB_REMOTE_URI, {
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));


