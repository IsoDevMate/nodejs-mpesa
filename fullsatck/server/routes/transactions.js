const router =require("express").Router()
const {getAccessToken} = require("../middleware/generatetoken")
const transacControllers = require("../controllers/trxncontrollers")
const generateControllers=require("../controllers/generateqrcontroller")
const {sendqr} = require("../controllers/generateqrcontroller")
// STEP 2: STK push
router.post("/stk",getAccessToken,transacControllers.payAmount)
//generate qr code
router.post("/generateqr",getAccessToken,generateControllers.sendqr)
// STEP 3: Callback URL
router.post("/myCallBack",transacControllers.myCallBack)
//STEP 5:Fetch all transactions
router.get("/allTransactions",transacControllers.fetchAllTransactions)
router.post("/handler",transacControllers.handler)
//STEP 6:Fetch one transaction
router.get("/oneTransaction/:id",transacControllers.fetchOneTransaction)
router.post("stkpushquery/",getAccessToken, transacControllers.stkpushQuery)
router.post("/register",getAccessToken, transacControllers.registerURLs);

router.post('/c2b/v1/confirm', transacControllers.confirmation);


router.post('/c2b/v1/validate', transacControllers.validation);


module.exports=router;