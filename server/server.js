const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mongoose=require('mongoose')
const connectDB=require('./trnxDb')
const port = process.env.PORT || 5050;
const transactions=require('./routes/transactions')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// connect Database
connectDB(); 

// apis
app.use('/api',transactions)


// test db connection

mongoose.connection.once('open',()=>{
  console.log(`Connected Successfully to the Database: ${mongoose.connection.name}`)
  app.listen(port, () => {
    console.log(`app is running at localhost:${port}`);
  });
  })

