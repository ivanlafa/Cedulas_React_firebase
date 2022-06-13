import firebase from "firebase/app";
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_UJdHg1EtLc9NIYEYzGRfLnnUNdoAGeg",
  authDomain: "cedula-cf0d1.firebaseapp.com",
  projectId: "cedula-cf0d1",
  storageBucket: "cedula-cf0d1.appspot.com",
  messagingSenderId: "624732917624",
  appId: "1:624732917624:web:9d11aeb43bc0a1e129828d"
};

firebase.initializeApp(firebaseConfig);
export{firebase}

