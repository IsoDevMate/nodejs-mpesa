const express = require('express')
const app =express()// define the routes/middleware and handle incoming HTTP requests.for an express app instance.
require("dotenv").config() //save secret keys
const cors = require('cors') //allow API requests from different Domains
const axios = require('axios')

//starting  your server
const port = process.env.PORT || 5003
app.listen(port,()=>{
    console.log(`server listening  on ${port} `)
})
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())
app.get('/token',(req,res)=>{ 
    //res.send('<h1>WELCOME</h1>')
    generateToken();

})
//middleware function to generate a tokem
const generateToken = async (req,res,next)=>{
    //if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    //we should base 64 encode the secret and consumer key

    const secret = process.env.MPESA_SECRET_KEY 
    const consumer = process.env.MPESA_CONSUMER_KEY 
    const auth = new Buffer.from(`${consumer}+${secret}`).toString("base64");
    await axios.get("https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",{
        headers:{
            auhorization : `Basic ${auth}`,
        },
    }).then((data)=>{
        console.log(data.token)
        next();
    }).catch((err) =>{
        console.log(err)
            res.status(500).json(err.message)
        }
    )
};
app.post('/stk',generateToken ,async (req,res) =>{
    const phone =req.body.phone.substring(1)
    const amount =req.body.amount

    res.json({ phone,amount })
})

//generating a timestamp
const date =new Date();
const timestamp = 
     date.getFullYear()+
     ("0" + (date.getMonth() + 1)).slice(-2) +
     ("0" + date.getDate()).slice(-2) +
     ("0" + date.getHours()).slice(-2) +
     ("0" + date.getMinutes()).slice(-2) +
     ("0" + date.getSeconds()).slice(-2) 
    
const shorcode = process.env.MPESA_PAYBILL;
const passkey = process.env.MPESA_PASSKEY;

const password = new Buffer.from(shorcode + passkey + timestamp).toString("base64");

 const response = await axios.post(
    "https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query",

{    
   BusinessShortCode:process.env.MPESA_PAYBILL ,   
   Password : password,    
   Timestamp:timestamp,    
   Amount:"1",
   PartyA:`254${phone}`,
   PartyB:shorcode,
   PhoneNumber:`254${phone}`,
   TransactionType:"CustomerPayBillOnline",
   CallBackUrl:"httpd://mydomain.com/pat",
   AccountReference:`254${phone}`,
   TransactionDesc:"test"

}  ,{
    headers:{
        Authorization:`bearer ${token}`,
    },
}
).then((data)=>{
    console.log(data)
    res.status(200).json(data)
}).catch((err)=>{
    console.log(err.message)
    res.status(400).json(err.message)
})