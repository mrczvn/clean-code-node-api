const App = require('./config/app');
const mongoHelper = require('../infra/helpers/mongo-helper');
const env = require('./config/env');

const setupApp = (app) => {
  mongoHelper
    .connect(env.mongoUrl)
    .then(() => {
      app.listen(env.port, () => console.log(`Server is running`));
    })
    .catch(console.error);
};

setupApp(App);
