const express = require('express');
const app = express();
require("dotenv").config();
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const port = process.env.PORT || 5003;
const bodyParser = require('body-parser');
const Payment = require('./models/payment');
const Payment = require('./models/payment');

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
mongoose.connect(process.env.MONGO_URL).then(()=>{
  console.log('Connected to MongoDB');
}).catch((err)=>{
  console.log(err);
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const generateToken = (req, res, next) => {
  const secret = process.env.MPESA_SECRET_KEY;
  const consumer = process.env.MPESA_CONSUMER_KEY;
  const auth = Buffer.from(`${consumer}:${secret}`).toString("base64");

 axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
   {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  })
    .then((response) => {
      req.token = response.data.access_token;
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err.message);
    });
};

app.get('/token', generateToken, (req, res) => {
  res.send('<h1>WELCOME</h1>');
});

app.post('/stk', generateToken, (req, res) => {
  const phone = req.body.phone.substring(1);
  const amount = req.body.amount;

  res.json({ phone, amount });
});

const date = new Date();
const timestamp =
  date.getFullYear() +
  ("0" + (date.getMonth() + 1)).slice(-2) +
  ("0" + date.getDate()).slice(-2) +
  ("0" + date.getHours()).slice(-2) +
  ("0" + date.getMinutes()).slice(-2) +
  ("0" + date.getSeconds()).slice(-2);

const shorcode = process.env.MPESA_PAYBILL;
const passkey = process.env.MPESA_PASSKEY;

const password = Buffer.from(shorcode + passkey + timestamp).toString("base64");

app.post('/stk', generateToken, (req, res) => {
  const phone = req.body.phone.substring(1);
  const token = req.token;

  axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
    {
      BusinessShortCode: process.env.MPESA_PAYBILL,
      Password: password,
      Timestamp: timestamp,
      Amount: "1",
      PartyA: `254${phone}`,
      PartyB: shorcode,
      PhoneNumber: `254${phone}`,
      TransactionType: "CustomerPayBillOnline",
      CallBackURL: "https://64da-41-212-28-3.ngrok-free.app/c2b",
      AccountReference: `254${phone}`,
      TransactionDesc: "test"
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((data) => {
      console.log(data.data);
      res.status(200).json(data.data);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(400).json(err.message);
    });
});

app.post('/c2b', generateToken, (req, res) => {
  const callBackData = req.body;
   console.log(callBackData.Body);
   if(!callBackData.Body.stkCallback.callBackMetaData){
    console.log(callBackData.Body)
    return res.json('ok')
   }
   //console.log(callBackData.Body.stkCallback.CallcallBackMetaData);

   const phone = callBackData.Body.stkCallback.CallcallBackMetaData.item[4].value
   const amount = callBackData.Body.stkCallback.CallcallBackMetaData.item[0].value
   const trnx_id = callBackData.Body.stkCallback.CallcallBackMetaData.item[1].value

   console.log({phone,amount,trnx_id})
   const Payment = new  Payment
   paymnent.number = phone
   payment.amount = amount
   payment.trnx_id=trnx_id
   paayment.save().then((data)=>{
    console.log(data)
   }).catch((err)=>{
    console.log(err.message)
   })
})
