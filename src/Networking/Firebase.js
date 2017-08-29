import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyDHQikqQ6e3q78jI9u5Us-uayAFBuFVTgM',
  authDomain: 'classical-spelling-bee.firebaseapp.com',
  databaseURL: 'https://classical-spelling-bee.firebaseio.com',
  storageBucket: "classical-spelling-bee.appspot.com"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const Firebase = {
  words: firebaseApp.database().ref().child('mobile').child('words'),
  matches: firebaseApp.database().ref().child('web').child('matches-multiplayer')
}

export default Firebase;
