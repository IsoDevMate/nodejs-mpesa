/* const axios=require('axios') */
/* const Payment=require('../models/payment') */

const { body, validationResult } = require('express-validator');
const axios = require('axios');

exports.payAmount = async (req, res) => {
  try {
    // Validate req.body using express-validator
    const validationRules = [
      body('phone').isString().isLength({ min: 1 }),
      body('amount').isNumeric(),
    ];
    await Promise.all(validationRules.map(rule => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, amount } = req.body;

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

    const password = Buffer.from(shortCode + passkey + timestamp).toString(
      "base64"
    );

    const response = await axios.post(
      process.env.PAYMENT_URL,
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: `254${phone}`,
        PartyB: shortCode,
        PhoneNumber: `254${phone}`,
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: `254${phone}`,
        TransactionDesc: "TEST",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to initiate STK push" });
  }
};

  exports.myCallBack = async (req, res) => {
    const callbackData = req.body;

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
    const amount = amountObj.Value
  
    // Get Mpesa code
    const codeObj = body.Item.find(obj => obj.Name === 'MpesaReceiptNumber');
    const mpesaCode = codeObj.Value 
  
    // Get phone number
    const phoneNumberObj = body.Item.find(obj => obj.Name === 'PhoneNumber');
    const phone = phoneNumberObj.Value
  
    // Save the variables to a file or database, etc.
    // ...
  
    // Return a success response to mpesa
    return res.json("success");
  };
  