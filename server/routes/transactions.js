const router =require("express").Router()
const {getAccessToken} = require("../middleware/generatetoken")
const transacControllers = require("../controllers/trxncontrollers")
const {sendqr} = require("../controllers/generateqrcontroller")
// STEP 2: STK push
router.post("/stk",getAccessToken,transacControllers.payAmount)
//generate qr code
router.post("/generateqr",getAccessToken,sendqr)
// STEP 3: Callback URL
router.post("/myCallBack",getAccessToken,transacControllers.myCallBack)

//STEP 5:Fetch all transactions
router.get("/allTransactions",transacControllers.fetchAllTransactions)

module.exports=router;router.get("/allTransactions",transacControllers.fetchAllTransactions)