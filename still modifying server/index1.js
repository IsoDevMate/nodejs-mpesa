const express = require('express');
const app = express();
require("dotenv").config();
const cors = require('cors');
const fetch = require('cross-fetch');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/token', (req, res) => {
  const secret = process.env.MPESA_SECRET_KEY;
  const consumer = process.env.MPESA_CONSUMER_KEY;
  const auth = Buffer.from(`${consumer}:${secret}`).toString("base64");

  fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to generate token: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      res.json({ access_token: data.access_token });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err.message);
    });
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

app.post('/stk', (req, res) => {
  const phone = req.body.phone.substring(1);

  fetch("https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.body.token}`,
    },
    body: JSON.stringify({
      BusinessShortCode: process.env.MPESA_PAYBILL,
      Password: password,
      Timestamp: timestamp,
      Amount: "1",
      PartyA: `254${phone}`,
      PartyB: shorcode,
      PhoneNumber: `254${phone}`,
      TransactionType: "CustomerPayBillOnline",
      CallBackURL: "https://e9c5-41-212-28-3.ngrok-free.app/callBack",
      AccountReference: `254${phone}`,
      TransactionDesc: "test",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(400).json(err.message);
    });
});

app.post('/callBack', (req, res) => {
  let data = req.body;
  console.log(data);
  // Handle the callback data as needed
  res.sendStatus(200); // Send a response to acknowledge the callback
});

const port = process.env.PORT || 5000; // Choose a port number
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
