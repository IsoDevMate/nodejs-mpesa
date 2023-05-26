const express = require('express');
const app = express();
require("dotenv").config();
const cors = require('cors');
const axios = require('axios');

const port = process.env.PORT || 5003;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const generateToken = async (req, res, next) => {
  try {
    const secret = process.env.MPESA_SECRET_KEY;
    const consumer = process.env.MPESA_CONSUMER_KEY;
    const auth = Buffer.from(`${consumer}:${secret}`).toString("base64");

    const response = await axios.get("https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
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

app.get('/token', generateToken, (req, res) => {
  res.send('<h1>WELCOME</h1>');
});

app.post('/stk', generateToken, async (req, res) => {
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

app.post('/stk', generateToken, async (req, res) => {
  try {
    const phone = req.body.phone.substring(1);
    const token = req.token;

    const response = await axios.post(
      "https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query",
      {
        BusinessShortCode: process.env.MPESA_PAYBILL,
        Password: password,
        Timestamp: timestamp,
        Amount: "1",
        PartyA: `254${phone}`,
        PartyB: shorcode,
        PhoneNumber: `254${phone}`,
        TransactionType: "CustomerPayBillOnline",
        CallBackURL: "http://mydomain.com/pat",
        AccountReference: `254${phone}`,
        TransactionDesc: "test"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err.message);
    res.status(400).json(err.message);
  }
});
