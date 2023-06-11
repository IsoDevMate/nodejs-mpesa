const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const axios = require("axios");

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let token = '';

// STEP 1: Getting access token
const getAccessToken = async (req, res, next) => {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");

  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    token = response.data.access_token;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to get access token" });
  }
};

// STEP 2: STK push
app.post("/stk", getAccessToken, async (req, res) => {
  const phone = req.body.phone.substring(1); // Formatted to 72190........
  const amount = req.body.amount;

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

 // const callbackurl = process.env.CALLBACK_URL;

  const password = Buffer.from(shortCode + passkey + timestamp).toString(
    "base64"
  );

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
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: `254${phone}`,
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
    res.status(500).json({ error: "Failed to initiate STK push" });
  }
});

// STEP 3: Callback URL

app.post('/callback', (req, res) => {
  if (!req.body.Body.stkCallback.CallbackMetadata) {
    console.log(req.body.Body.stkCallback.ResultDesc);
    res.status(200).json("ok");
    return;
  }


  const amount = req.body.Body.stkCallback.CallbackMetadata.Item[0].Value;
  const code = req.body.Body.stkCallback.CallbackMetadata.Item[1].Value;
  const phone1 = req.body.Body.stkCallback.CallbackMetadata.Item[4].Value.toString().substring(3);
  const phone = `0${phone1}`;

  console.log({
    phone,
    code,
    amount,
  });

  res.status(200).json("ok");
});

// STK Push Query
app.post("/stkpushquery", getAccessToken, async (req, res) => {
  const CheckoutRequestID = req.body.CheckoutRequestID;

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

  try {
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: CheckoutRequestID,
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
    res.status(400).json({ error: "Failed to query STK push" });
  }
});

// Transactions endpoint
app.get("/transactions", (req, res) => {
  res.status(200).json({ message: "Transactions endpoint" });
});

app.listen(port, () => {
  console.log(`app is running at localhost:${port}`);
});
