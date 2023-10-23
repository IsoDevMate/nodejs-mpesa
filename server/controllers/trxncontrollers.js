const axios=require('axios')
const Payment=require('../models/payment')

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
    const callbackData = req.body;
    let  mpesaCode,amount,phone,date=""
    // Log the callback data to the console
    console.log(callbackData);
    
    // Send a response back to the M-Pesa
    res.json({ status: 'success' });
  
     // Check the result code
     const result_code = callbackData.Body.stkCallback.ResultCode;
     if (result_code !== 0) {
       // If the result code is not 0, there was an error
       const error_message = callbackData.Body.stkCallback.ResultDesc;
       const response_data = { ResultCode: result_code, ResultDesc: error_message };
       return res.json(response_data);
     }
   
     // If the result code is 0, the transaction was completed
     const body = req.body.Body.stkCallback.CallbackMetadata;
  
    // Get amount
    const amountObj = body.Item.find(obj => obj.Name === 'Amount');
    amount = amountObj.Value
  
    // Get receipt number
    const transxobj= body.Item.find(obj =>obj.Name === "TransactionDate");
      date = transxobj.Value


    // Get Mpesa code
    const codeObj = body.Item.find(obj => obj.Name === 'MpesaReceiptNumber');
    mpesaCode = codeObj.Value 
  
    // Get phone number
    const phoneNumberObj = body.Item.find(obj => obj.Name === 'PhoneNumber');
     phone = phoneNumberObj.Value
  
    // Save the variables to a file or database, etc.
    try {
    const newTransaction=await Payment.create({
      mpesaCode,amount,phone,date 
  })
   Payment.save() // Save the transaction to the database
   .then((result) => {
    console.log({message:"Transaction saved successfully",result});
  })
  .catch((err) => {
    console.log(err);
  });

    console.log(ResultDesc,newTransaction);
    return  res.status(201).json({message:`${ResultDesc}`,newTransaction})
    } catch (error) {
    console.log(error.message)
     return res.send({
      success:false,
      message:error.message
  });
    }
    
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
