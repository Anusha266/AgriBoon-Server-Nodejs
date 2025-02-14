const express=require('express')
const route=express.Router()
const userController=require('../controllers/usersController')
const authController=require('../controllers/authController')

route.get(process.env.GET_ALL,userController.getAll)
route.get(process.env.GET_BY_ID,userController.getUserByID)
route.get(process.env.GET_CURRENT_USER,authController.protect,userController.getCurrentUser)
route.post(process.env.CREATE_USER_PROFILE,authController.protect,userController.createProfile)
module.exports=route;

