const express = require('express');
const app = express();
require("dotenv").config();
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5003;
const user ={id:123, username: 'barack ouma'}
app.use(cors());

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const generateToken = async (req, res, next) => {
  try {
    const secret = process.env.MPESA_SECRET_KEY;
    const consumer = process.env.MPESA_CONSUMER_KEY;
    const auth = Buffer.from(`${consumer}:${secret}`).toString("Base64");

    const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      
    });

    req.token = response.data.access_token;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};



app.post('/stk', generateToken, async (req, res,next) => {
  try {
    const phone = req.body.phone.substring(1);
    const amount = req.body.amount;
    const token = req.token;

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

    const response = await axios.post(
      " https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequesty",
      {
        BusinessShortCode: process.env.MPESA_PAYBILL,
        Password: password,
        Timestamp: timestamp,
        Amount: `${amount}`,
        PartyA: `254${phone}`,
        PartyB: shorcode,
        PhoneNumber: `254${phone}`,
        TransactionType: "CustomerPayBillOnline",
        CallBackURL: "http://mydomain.com/path",
        AccountReference: `254${phone}`,
        TransactionDesc: "test"
      },
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      },
      next()
    );

    console.log(response.data);
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err.message);
    res.status(400).json(err.message);
  }
});
