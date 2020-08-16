const express = require('express');
const setupApp = require('./setup');

const app = express();

setupApp(app);

app.get('/', (req, res) => {
  res.send('API is running');
});

module.exports = app