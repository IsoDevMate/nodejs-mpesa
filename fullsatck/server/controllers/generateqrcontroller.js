const axios = require('axios');
const jwt_decode = require('jwt-decode');

exports.sendqr = async (req, res) => {
  //const { refNo: AccountReference, amount: amount } = req.body;
  //console.log(AccountReference , amount);
  //console.log(decoded)
  const BusinessShortCode = process.env.MPESA_PAYBILL;
  const {amount,AccountReference} = req.body
  let token = req.token;
  console.log(token)
  const send = async (amount,AccountReference) => {
    const payload =[{
        MerchantName: 'Daraja Sandbox',
        RefNo: AccountReference,
        Amount: amount,
        TrxCode: 'PB',
        CPI: BusinessShortCode,
        Size: '100',
    }];

    try {
      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/qrcode/v1/generate',
        payload, 
        {
          headers: {
            Authorization: `Bearer  ${token}`,
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

  send( amount,AccountReference);
};
