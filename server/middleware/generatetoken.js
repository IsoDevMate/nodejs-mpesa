const axios=require('axios')

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
  
      req.token = response.data.access_token;
      next();
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to get access token" });
    }
  };

  module.exports= getAccessToken
  
