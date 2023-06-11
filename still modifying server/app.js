const express = require('express');
const fetch = require('cross-fetch');
require("dotenv").config();

const port = process.env.PORT || 3000;
const app = express();

// Function to generate the access token
const generateAccessToken = () => {
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data.access_token)
    .catch((error) => {
      console.error('Error generating access token:', error);
      throw new Error('Failed to generate access token');
    });
};

// Function to initiate the STK push
const initiateStkPush = async (accessToken, payload) => {
  try {
    const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Failed to initiate STK push: ${errorResponse.errorMessage}`);
    }

    const data = await response.json();
    console.log('STK push initiated:', data);
  } catch (error) {
    console.error('Error initiating STK push:', error);
    throw error;
  }
};

app.use(express.json());

app.get('/access-token', async (req, res) => {
  try {
    // Generate the access token
    const accessToken = await generateAccessToken();

    // Send the access token in the response
    res.status(200).json({ access_token: accessToken });
  } catch (error) {
    console.error('Error generating access token:', error);
    res.status(500).json({ error: 'Failed to generate access token' });
  }
});

app.post('/initiate-stk-push', async (req, res) => {
  try {
    const payload = req.body; // Assuming you send the payload in the request body

    // Extract the required credentials
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

    const password = Buffer.from(shorcode + passkey + timestamp).toString('base64');

    // Generate the access token
    const accessToken = await generateAccessToken();

    // Update the payload with the calculated password
    payload.Password = password;

    // Initiate the STK push with the access token and payload
    await initiateStkPush(accessToken, payload);

    // Send response indicating success
    res.status(200).json({ message: 'STK push initiated successfully' });
  } catch (error) {
    console.error('Error initiating STK push:', error);
    res.status(500).json({ error: 'Failed to initiate STK push' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
