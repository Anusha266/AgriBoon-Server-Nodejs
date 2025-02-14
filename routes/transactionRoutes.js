const express=require('express')
const router=express.Router();
const transactionController=require('../controllers/transactionController')
const authController=require('../controllers/authController')

router.get(process.env.GET_TRANSACTION_DATA_BY_STATUS_OF_PRODUCT,transactionController.getByProductStatus)
router.post(process.env.CREATE,authController.protect,transactionController.createData)
router.get(process.env.GET_ALL,transactionController.getAll)
router.patch(process.env.UPDATE_BY_ID,transactionController.update)

router.post(process.env.COMPARE_OTP,transactionController.compareOTP)

router.post(process.env.GET_TRANSACTION_DATA_BY_PRODUCT_ID_createdOn,transactionController.get_data_by_product_details)
  
router.get(process.env.GET_BY_ID,transactionController.getTransactionById)

router.post(process.env.GET_SELLER_TRANSACTION_DATA,transactionController.getSellerData)
router.post(process.env.GET_BUYER_TRANSACTION_DATA,transactionController.getBuyerData)

module.exports=router;