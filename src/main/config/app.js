const express = require('express');
const setupApp = require('./setup');
const setupRoutes = require('./routes');

const app = express();

setupApp(app);
setupRoutes(app);

app.get('/', (req, res) => {
  res.send('API is running');
});

module.exports = app;
