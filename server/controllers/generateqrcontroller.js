const axios = require('axios');


exports.sendqr = async (req, res) => {
  const { refNo: AccountReference, amount: amount } = req.body;
  console.log(AccountReference, amount);
  const BusinessShortCode = process.env.MPESA_PAYBILL;
  let token = `${req.token}`; // Replace with your actual access token

  const send = async (refNo, amount) => {
    const payload =[{
        MerchantName: 'Daraja Sandbox',
        RefNo: refNo,
        Amount: amount,
        TrxCode: 'PB',
        CPI: BusinessShortCode,
        Size: '250',
    }];

    try {
      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/qrcode/v1/generate',
        payload, // Remove the extra object around payload
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Add the Content-Type header
          },
        }
      );
      res.status(200).json(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: 'Failed to generate QR code' });
    }
  };

  send(AccountReference, amount);
};
