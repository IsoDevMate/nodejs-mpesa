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

// push notification route 
app.post('/save-token', (req, res) => {
  const { token, userId } = req.body;
  console.log(token, userId);
  // save these details in your database and associate the token with the userId somehow,
  // usually by adding the userId to the token table alongside the token
const tokenSchema=new mongoose.Schema({
  token:{
    type:String,
    required:true
  },
  userId:{
    type:Number,
    required:true
  }
})

const Token=mongoose.model('Token',tokenSchema)

const newToken=new Token({
  token,
  userId
})


newToken.save()
.then((data)=>{

  console.log(data)
})
.catch((err)=>{
  console.log(err)
})

  res.send({ 'result': 'ok' });
});
  

app.post('/send-notification', async(req, res) => {
  const { title, body, icon, token } = req.body;
  console.log(title, body, icon, token);
  // send push notification to user
  
  const payload = {
    notification: {
      title,
      body,
      icon,
    }
  };
  const options = {
    TTL: 3600
  };

  const subscritions= await Token.findOne({ userId: userId });
  console.log(subscritions)
  
  
 /* admin.messaging().sendToDevice(token, payload, options)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
*/
  res.send({ 'result': 'ok' });
});




// test db connection

mongoose.connection.once('open',()=>{
  console.log(`Connected Successfully to the Database: ${mongoose.connection.name}`)
  app.listen(port, () => {
    console.log(`app is running at localhost:${port}`);
  });
  })

