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
app.get('/',(req,res)=>{ 
    res.send('<a href="http://barackouma-portfolio.surge.sh/#skills">Log into my website</a>')
})

app.post('/stk',(req,res) =>{
    const phone =req.body.phone
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

await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",

{    
   BusinessShortCode:process.env.MPESA_PAYBILL ,   
   Password : password,    
   Timestamp:timestamp,    
   Amount:"1",
   PartyA:"254769784198",
   PartyB:"5170923",
   PhoneNumber:"254769784198",
   TransactionType:"CustomerPayBillOnline",
   CallBackUrl:"httpd://mydomain.com/pat",
   Transaction

}  
)