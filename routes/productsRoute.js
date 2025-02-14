
const express=require('express')
const router=express.Router();
const productController=require('../controllers/productsController')
const authController=require('../controllers/authController');
const { _router } = require('../app');

  
router.post(process.env.CREATE,authController.protect,productController.upload)
router.get(process.env.GET_ALL,productController.fetch_all)
router.get(process.env.GET_BY_ID,productController.getProductById)
router.get(process.env.GET_CART_PRODUCTS,productController.getCardProducts)
router.delete(process.env.DELETE_BY_ID,productController.deleteProduct)
router.patch(process.env.UPDATE_BY_ID,productController.updateProduct)
module.exports=router;  

