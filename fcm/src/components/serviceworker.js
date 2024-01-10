if ('ServiceWorker' in navigator){
    navigator.serviceWorker.register('serviceworker.js')
}

//get user-permmisssion to send push notifications
function showPermission(){
if('Notification' in window){
    const permissions =   Notification.requestPermission()
    .then(function(permission){
    if(permissions === 'granted'){
      console.log('Notification permission granted');
      return

    }else if(permissions === 'denied'){
      console.log('Notification permission denied');
      return;
    }
}).catch (function(err){
    console.log('error occured', err);
    return;
})
}
}

importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");


const firebaseConfig = {
    apiKey: "AIzaSyCpd0Mwy_BudiA-z3KMsfrqw3nt3Gy7h6M",
    authDomain: "native-functions-dd65b.firebaseapp.com",
    projectId: "native-functions-dd65b",
    storageBucket: "native-functions-dd65b.appspot.com",
    messagingSenderId: "773232537571",
    appId: "1:773232537571:web:68ab00cedad20c66397ad6"
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
      // ...
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
   
  });
/*messaging.setBackgroundMessageHandler(function(payload) {
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true
    })
    .then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    })
    .then(() => {
      return registration.showNotification("my notification title");
    });
  return promiseChain;
}); */

self.addEventListener('notificationclick', function(event) {
 
});