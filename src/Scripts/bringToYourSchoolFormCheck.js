const firebase = require('firebase');
const Slack = require('node-slack');
const CONFIG = require('../Config/main');

const slack = new Slack(process.env.SLACK_HOOK_URL, {});

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const ref = firebaseApp.database().ref().child('web').child('forms');

const date = new Date();

ref.once('value').then(async (snap) => {
  const submissions = Object.keys(snap.val()).map((k) => snap.val()[k]);
  
  const newSubmissions = submissions.filter((s) => {
    const diffMs = (date - s.timestamp)    
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000)
    return diffMins <= 10
  })

  for (let submission of newSubmissions) {
    await postToSlack(submission);
  }

  return;
});

const postToSlack = async (data) => {
  let message = `${data.firstName} ${data.lastName} (email: ${data.email}) from ${data.school} just submitted a form.\n\n`
  
  if (data.comments.length) {
    message += `In the comments section he/she wrote: ${data.comments}`
  }

  await slack.send({
    text: message,
    channel: '#growth',
    username: 'Form-Bot'
  });

  return;
}
