const axios=require('axios')
const Transaction = require('../models/payment');

const prettyjson = require('prettyjson');
exports.payAmount=async(req,res)=>{
    const phone = req.body.phone.substring(1); // Formatted to 72190........
    const amount = req.body.amount;
    if(!phone) return res.status(400).json({message:"Phone Number is required"})
    if(!amount) return res.status(400).json({message:"Amount is required"})

    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);
    const shortCode = process.env.MPESA_PAYBILL;
    const passkey = process.env.MPESA_PASSKEY;
    let token = req.token;
   // const callbackurl = process.env.CALLBACK_URL;
  
    const password = Buffer.from(shortCode + passkey + timestamp).toString(
      "base64"
    );
  console.log(req.token)
    try {
      const response = await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
          BusinessShortCode: shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: `254${phone}`,
          PartyB: shortCode,
          PhoneNumber: `254${phone}`,
          CallBackURL:process.env.CALLBACKURL || "https://us-central1-stripe-sendgrid.cloudfunctions.net/mpesaStkUrl/api/myCallBack",
          AccountReference: `${phone}`,
          TransactionDesc: "TEST",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      res.status(200).json(response.data);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: "Failed to make payment" });
    }
  };

  exports.myCallBack = async (req, res) => {
  
    const options = {
      noColor: true,
    };
    console.log(prettyjson.render(req.body, options));
    if (req.body.Body && req.body.Body.stkCallback) {
    const {MerchantRequestID, CheckoutRequestID,ResultCode,ResultDesc,CallbackMetadata} = req.body.Body.stkCallback;
    if (ResultCode === 0) {
    
    const {Item} = CallbackMetadata;
    //console.log(Item)
    const receiptNumber =Item.find(item =>item.Name ===  "MpesaReceiptNumber").Value;
    const amount =Item.find(item =>item.Name ===  "Amount").Value;
    const transactionDate =Item.find(item =>item.Name ===  "TransactionDate").Value;
    const phoneNumber =Item.find(item =>item.Name ===  "PhoneNumber").Value;
    
    console.log(receiptNumber,amount,transactionDate,phoneNumber)
    }
    console.log(MerchantRequestID,CheckoutRequestID,ResultCode,ResultDesc,CallbackMetadata)
  
    //handleunsuccesful transaction
if (ResultCode !== 1032) {
  const {Item} = CallbackMetadata;
  console.log(Item)
  const receiptNumber =Item.find(item =>item.Name ===  "MpesaReceiptNumber").Value;
  const amount =Item.find(item =>item.Name ===  "Amount").Value;
  const transactionDate =Item.find(item =>item.Name ===  "TransactionDate").Value;
  const phoneNumber =Item.find(item =>item.Name ===  "PhoneNumber").Value;

  console.log(receiptNumber,amount,transactionDate,phoneNumber)
}
else{
  console.log("stkCallback is missing in the request body");
}

    //handle timeout transaction
  /*  const transaction = new Transaction({
      receiptNumber,
      amount,
      transactionDate,
      phoneNumber
    })

    await transaction.save();
    console.log(transaction)
*/
// db(receiptNumber,amount,transactionDate,phoneNumber)
    }
    
    
  
   // const db=async(receiptNumber,amount,transactionDate,phoneNumber)=>{
//console.log("helloo")
    
 /* exports.fetchAllTransactions=async(req,res)=>{
    try {
      Transaction.find()
      .then(transactions => res.json(transactions))
      .catch(err => res.status(400).json('Error: '+err));
    } catch (error) {
      console.log(error.message)
      return res.send({
        success:false,
        message:error.message
      });
    }*/
     // const db=(receiptNumber,amount,transactionDate,phoneNumber)=>{
       /* const allTransactions=await Transaction.find();
        console.log(allTransactions)
        return res.status(200).json(allTransactions)

    } catch (error) {
        console.log(error.message)
        return res.send({
            success:false,
            message:error.message
        });
    }*/
}
exports.fetchOneTransaction=async(req,res)=>{
  try {
    const {id}=req.params;
    const transaction=await Transaction.findById(id);
    console.log(transaction)
    return res.status(200).json(transaction)

} catch (error) { console.log("Transaction not completed")
    console.log(error.message)
    return res.send({
        success:false,
        message:error.message
    });
}
}


/* router.route('/').get((req,res)=>{
  Transaction.find()
  .then(transactions => res.json(transactions))
  .catch(err => res.status(400).json('Error: '+err));
});

router.route('/add').post((req,res)=>{
  const transaction = req.body;
  const newTransaction = new Transaction(transaction);

  newTransaction.save()
  .then(()=> res.json('Transaction added!'))
  .catch(err=> res.status(400).json('Error: '+ err));
}); */


//     console.log(callbackData);   
//     // Get the transaction status
//     const transaction_status = body.Item.find(
//       (obj) => obj.Name === "ResultDesc"
//     ).Value;
//
//     // Get the transaction date
//     const transaction_date = body.Item.find(
//       (obj) => obj.Name === "TransactionDate"
//     ).Value;
