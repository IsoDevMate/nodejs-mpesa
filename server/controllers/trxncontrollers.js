const axios=require('axios')
const Payment=require('../models/payment')
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
          CallBackURL:"https://1d64-41-212-65-143.ngrok-free.app/api/myCallBack",
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
    const {MerchantRequestID, CheckoutRequestID,ResultCode,ResultDesc,CallbackMetadata} = req.body.Body.stkCallback;
    if (ResultCode === 0) {
    
    const {Item} = CallbackMetadata;
    console.log(Item)
    const receiptNumber =Item.find(item =>item.Name ===  "MpesaReceiptNumber").Value;
    const amount =Item.find(item =>item.Name ===  "Amount").Value;
    const transactionDate =Item.find(item =>item.Name ===  "TransactionDate").Value;
    const phoneNumber =Item.find(item =>item.Name ===  "PhoneNumber").Value;
    
 db(receiptNumber,amount,transactionDate,phoneNumber)
    }

res.send("ok")

   
   
    }
    
  
    const db=async(receiptNumber,amount,transactionDate,phoneNumber)=>{
console.log("helloo")
    }
  exports.fetchAllTransactions=async(req,res)=>{
    try {
        const allTransactions=await Payment.find();
        console.log(allTransactions)
        return res.status(200).json(allTransactions)

    } catch (error) {
        console.log(error.message)
        return res.send({
            success:false,
            message:error.message
        });
    }
}



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
