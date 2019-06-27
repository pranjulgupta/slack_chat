import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyB2_WN7RFZdXHurcwSgU1ppet__CYsOBIc",
    authDomain: "react-slack-clone-29e77.firebaseapp.com",
    databaseURL: "https://react-slack-clone-29e77.firebaseio.com",
    projectId: "react-slack-clone-29e77",
    storageBucket: "react-slack-clone-29e77.appspot.com",
    messagingSenderId: "914164468930",
    appId: "1:914164468930:web:1d862ed45da1a218"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;