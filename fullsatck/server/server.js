const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mongoose=require('mongoose')
const connectDB=require('./trnxDb')
const port = process.env.PORT || 5050;
const transactions=require('./routes/transactions')

const Token=require('./models/TokenSchema')
var admin = require("firebase-admin");

var serviceAccount = require("./native-functions-dd65b-firebase-adminsdk-1x0vr-ca83278fbc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://native-functions-dd65b-default-rtdb.firebaseio.com"
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// connect Database
connectDB(); 

// apis
app.use('/api',transactions)

app.get("/", (req, res) => {
  res.send("Hello World");
});

// push notification route 
app.post('/save-token', (req, res) => {
  const { token, userId } = req.body;
  console.log(token, userId);
  // save these details in your database and associate the token with the userId somehow,
  // usually by adding the userId to the token table alongside the token

const newToken=new Token({
  token,
  userId
})

newToken
.save()
.then((data) => {
  console.log(data);
  res.status(200).json({ message: 'Token saved successfully' });
})
.catch((err) => {
  console.log(err);
  res.status(500).json({ error: 'Failed to save token' });
});
//res.send({ 'result': 'ok' });
});


app.post('/send-notification', async (req, res) => {
  const { title, body, userId } = req.body;
  console.log(title, body, userId);

  try {
    const subscriptions = await Token.find({ userId });

    const tokens = subscriptions.map((subscription) => subscription.token);

    const payload = {
      notification: {
        title,
        body,
      },
    };

    const options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24, 
    };


    const response = await admin.messaging().sendToDevice(tokens, payload, options);
    response.results.forEach((result, index) => {
    const error = result.error;
    if (error) {
      console.error('Failure:', error.code);
       if (error.code === 'messaging/registration-token-not-registered') {
      // Remove the invalid token from your database
      const invalidToken = tokens[index];
      Token
        .deleteOne({ token: invalidToken })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });

    console.log('Successfully sent message:', response);
    res.status(200).json({ message: 'Notification sent successfully' });
  }
}
  });
  } catch (error) {
    console.log('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});


/*
app.post('/send-notification', async(req, res) => {
  const { title, body, token } = req.body;
  console.log(title, body, token);
  // send push notification to user
  
  const payload = {
    notification: {
      title,
      body,
    }
  };
  const options = {
    TTL: 3600
  };

  const subscriptions= await Token.findOne({ userId: userId });
  console.log(subscriptions)
  
  admin.messaging().sendToDevice(token, payload, options)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });

  res.send({ 'result': 'ok' });
});

*/


mongoose.connection.once('open',()=>{
  console.log(`Connected Successfully to the Database: ${mongoose.connection.name}`)
  app.listen(port, () => {
    console.log(`app is running at localhost:${port}`);
  });
  })

