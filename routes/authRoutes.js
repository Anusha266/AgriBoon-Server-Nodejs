const express=require('express');
const authController=require('../controllers/authController');

const router=express.Router();


router.post(process.env.SIGNUP_ROUTE,authController.signup);

router.post(process.env.LOGIN_ROUTE,authController.login)

module.exports=router;