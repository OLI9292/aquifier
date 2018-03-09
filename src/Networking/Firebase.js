import * as firebase from 'firebase';
import _ from 'underscore';

import { guid, toArr } from '../Library/helpers';
import CONFIG from '../Config/main';

const firebaseConfig = {
  apiKey: CONFIG.FIREBASE_API_KEY,
  authDomain: CONFIG.FIREBASE_AUTH_DOMAIN,
  databaseURL: CONFIG.FIREBASE_DATABASE_URL,
  storageBucket: CONFIG.FIREBASE_STORAGE_BUCKET
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const refs = {
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

const Firebase = {
  refs: refs,

  canEnterGame: (name, accessCode) => {
    return refs.games.child(accessCode).once('value').then(snapshot => validate(snapshot.val(), name, accessCode));
  },

  joinGame: async (name, accessCode) => {
    const player = {};
    player[name] = 0;
    return refs.games.child(accessCode).child('players').update(player).then(() => true).catch(() => false);
  },

  sendForm: async (inputs) => {
    return refs.forms.child(guid()).set(inputs).then(() => true).catch(() => false);
  }
}

export default Firebase;
