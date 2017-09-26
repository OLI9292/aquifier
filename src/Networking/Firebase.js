import * as firebase from 'firebase';
import _ from 'underscore';

import Word from '../Models/Word';
import { guid, toArr } from '../Library/helpers';

const firebaseConfig = {
  apiKey: 'AIzaSyDHQikqQ6e3q78jI9u5Us-uayAFBuFVTgM',
  authDomain: 'classical-spelling-bee.firebaseapp.com',
  databaseURL: 'https://classical-spelling-bee.firebaseio.com',
  storageBucket: 'classical-spelling-bee.appspot.com'
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const refs = {
  words: firebaseApp.database().ref().child('mobile').child('words'),
  games: firebaseApp.database().ref().child('web').child('games'),
  forms: firebaseApp.database().ref().child('web').child('forms')
}

function validate(snapshot, name, accessCode) {
  if (!snapshot) {
    return [false, 'Access code not found.'];
  }
  if (snapshot.status === 2) {
    return [false, 'Game has ended.'];
  }
  if (snapshot.players && _.includes(toArr(_.keys(snapshot.players)), name)) {
    return [false, 'Name taken.'];
  }
  return [true, snapshot];
}

function mapWords(snapshot) {
  let wordObj = snapshot.val();
  return _.keys(wordObj).map((val) => Word(val, wordObj[val])).filter((w) => !_.isNull(w));
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
    return refs.games.child(accessCode).child('players').update(player).then(() => true).catch(() => false);
  },

  sendForm: async (inputs) => {
    return refs.forms.child(guid()).set(inputs).then(() => true).catch(() => false);
  },

  fetchWords: async () => {
    return refs.words.once('value').then(mapWords);
  }
}

export default Firebase;
