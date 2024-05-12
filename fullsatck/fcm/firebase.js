
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { GoogleAuthProvider, updateCurrentUser } from 'firebase/auth';
import  { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyCpd0Mwy_BudiA-z3KMsfrqw3nt3Gy7h6M",
    authDomain: "native-functions-dd65b.firebaseapp.com",
   projectId: "native-functions-dd65b",
    storageBucket: "native-functions-dd65b.appspot.com",
    messagingSenderId: "773232537571",
    appId: "1:773232537571:web:68ab00cedad20c66397ad6"
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
//export const sets = db.settings(settings)

export const  auth =getAuth(app);
export const db =getFirestore(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider( );
export { collection, addDoc };