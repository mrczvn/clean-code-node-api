const loginRouter = require('../composer/login-router-composer');
const expressRouterAdapter = require('../adapters/express-router-adapter');

module.exports = (router) => {
  router.post('/login', expressRouterAdapter.adapt(loginRouter));
};
