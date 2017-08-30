import * as firebase from 'firebase';
import Word from '../Models/Word';
import _ from 'underscore';

const firebaseConfig = {
  apiKey: 'AIzaSyDHQikqQ6e3q78jI9u5Us-uayAFBuFVTgM',
  authDomain: 'classical-spelling-bee.firebaseapp.com',
  databaseURL: 'https://classical-spelling-bee.firebaseio.com',
  storageBucket: "classical-spelling-bee.appspot.com"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const refs = {
  words: firebaseApp.database().ref().child('mobile').child('words'),
  // TODO: - rename
  games: firebaseApp.database().ref().child('web').child('matches-multiplayer')  
}

function validate(snapshot, name, accessCode) {
  if (!snapshot) {
    return [false, 'Access code not found.'];
  }
  if (snapshot.status === 2) {
    return [false, 'Game has ended.'];
  }
  // TODO: - throw error if player name taken 
  return [true, snapshot];
}

function verifyUpdate(e) {
  if (e) {
    return 'Could not join game.';
  }
  return null;
}

function mapWords(snapshot) {
  let wordObj = snapshot.val();
  return _.keys(wordObj).map((val) => Word(val, wordObj[val]));
}

const Firebase = {
  refs: refs,

  canEnterGame: (name, accessCode) => {
    if (!accessCode) {
      return [false, 'Please enter an access code.'];
    }
    if (!name) {
      return [false, 'Please enter your name.'];
    }
    return refs.games.child(accessCode).once('value').then(snapshot => validate(snapshot.val(), name, accessCode));
  },

  joinGame: async (name, accessCode) => {
    const player = {};
    player[name] = 0;
    return refs.games.child(accessCode).child('scores').update(player).then(() => true).catch(() => false);
  },

  waitingForGame: async (accessCode) => {
    return refs.games.child(accessCode).child('status').on('value').then(snapshot => snapshot.val());
  },

  fetchWords: async () => {
    return refs.words.once('value').then(mapWords);
  }
}

export default Firebase;
