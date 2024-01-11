
const serviceWorker = () => {
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

showPermission()



self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://developers.google.com/web/')
  );
 
});

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  
  const title = 'Push Codelab';
  const options = {
    body: 'Yay it works.',
    icon: 'images/icon.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
})
  
  }

export default serviceWorker;

