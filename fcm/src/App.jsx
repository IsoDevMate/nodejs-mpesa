import React from 'react'

const App = () => {
  const [token, setToken] = React.useState(null)


  
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");


const firebaseConfig = {
  //  apiKey: "AIzaSyCpd0Mwy_BudiA-z3KMsfrqw3nt3Gy7h6M",
  //  authDomain: "native-functions-dd65b.firebaseapp.com",
  //  projectId: "native-functions-dd65b",
 //   storageBucket: "native-functions-dd65b.appspot.com",
    messagingSenderId: "773232537571",
   // appId: "1:773232537571:web:68ab00cedad20c66397ad6"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

db.settings(settings);

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.

messaging.getToken({ vapidKey: 'BCoO1P9J8gNhj1KjSRxgFW88XeIVjgCG2y7YtzkRQP-uprmlqtjwveYHnJWEQj52MYzqQuJ-ddXxcfQkcLqAvdw' }).then((currentToken) => {
    if (currentToken) {
          // Send the token to your server and update the UI if necessary
    fetch('/save-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: currentToken,
            userId: Math.floor(Math.random() * 100) + 1
        })
    }).then((res) => {
        if (res.status !== 200) {
            console.log('Unable to save token to the database');
        }
        return res.json()
    }).then((data) => {
        console.log(data);
    })
    
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
    
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
   
  });

  //when the app is in the background
  messaging.setBackgroundMessageHandler(function(payload) {

    var obj = JSON.parse(payload.data.notification);
    var objTitle = obj.title;
    const notificationOptions = {
      body: obj.body,
      icon: obj.icon,
    };
  
    return self.registration.showNotification(notificationTitle,
      notificationOptions);
  })

  //when the app is in the foreground
  messaging.onMessage(function(payload) {
    console.log('Message received. ', payload);
    
  });
  function sendNotification({subscription}) {
    const message = {
      to: token,
      notification: {
        title: 'FCM Message',
        body: 'This is an FCM Message',
        click_action: 'http://localhost:5050',
        icon: 'http://url-to-an-icon/icon.png'
      },
      token: token,
    }
 
 messaging.send(message)
 .then((response) => {
   console.log('Successfully sent message:', response)
   return response
   }
  )
  .catch((error) => {
    console.log('Error sending message:', error)
    return error
  })
  }
  React.useEffect(() => {
    messaging.requestPermission()
    .then(() => {
      return messaging.getToken()
    })
    .then((token) => {
      console.log('Token:', token)
      setToken(token)
    })
    .catch((error) => {
      console.log('Error:', error)
    })
  }, [])

  



  return (
    <div>
      <h1>FCM</h1>
    </div>
  )
}

export default App