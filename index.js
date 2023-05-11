const express = require('express')
const app =express()// define the routes/middleware and handle incoming HTTP requests.for an express app instance.
require("dotenv").config() //save secret keys
const cors = require('cors') //allow API requests from different Domains

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