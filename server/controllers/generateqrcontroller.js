const axios = require('axios');
const jwt_decode = require('jwt-decode');

exports.sendqr = async (req, res) => {
  //const { refNo: AccountReference, amount: amount } = req.body;
  //console.log(AccountReference , amount);
 // const decoded=jwt_decode(req.token);
  //console.log(decoded)
  const BusinessShortCode = process.env.MPESA_PAYBILL;
  let token = `${req.token}`; // Replace with your actual access token
console.log(token)
  const send = async (refNo, amount) => {
    const payload =[{
        MerchantName: 'Daraja Sandbox',
        RefNo: req.body.AccountReference,
        Amount: req.body.amount,
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
            Authorization: `Bearer  ${token}`,
          },
        }
      );
      res.status(200).json(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Failed to generate QR code' });
    }
  };

  send(AccountReference, amount);
};
