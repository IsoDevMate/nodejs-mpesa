const router =require("express").Router()
const {getAccessToken} = require("../middleware/generatetoken")
const transacControllers = require("../controllers/trxncontrollers")

// STEP 2: STK push
router.post("/stk",getAccessToken,transacControllers.payAmount)

// STEP 3: Callback URL
router.post("/myCallBack",getAccessToken,transacControllers.myCallBack)


//STEP 5:Fetch all transactions
router.get("/allTransactions",transacControllers.fetchAllTransactions)

module.exports=router;router.get("/allTransactions",transacControllers.fetchAllTransactions)