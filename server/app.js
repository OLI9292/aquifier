const express = require('express');
const morgan = require('morgan');
const path = require('path');
const sslRedirect = require('heroku-ssl-redirect');

const app = express();

// enable ssl redirect
app.use(sslRedirect());

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Allow Origin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, access_token, key, session')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.get('/.well-known/acme-challenge/:content', (req, res) => {
  res.send('Xgr_mooYDqwofhfAybNFnqDfQlvIkrIMMAUYSxHCb9k')
})

module.exports = app;
