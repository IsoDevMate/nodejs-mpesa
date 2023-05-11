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

await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query"

{    
   BusinessShortCode:process.env.MPESA_PAYBILL ,   
   Password : "MTc0Mzc5YmZiMjc5TliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMTYwMjE2MTY1NjI3",    
   Timestamp:"20160216165627",    
   CheckoutRequestID: "ws_CO_260520211133524545",     
   ResponseCode:"0",    
   ResponseDescription: "The service request has been accepted successfully",    
   MerchantRequestID:"22205-34066-1",    
   CheckoutRequestID: "ws_CO_13012021093521236557",
   ResultCode:"0",
   ResultDesc:"The service request is processed successfully.",

}  
)