const loginRouterComposer = require('../composer/login-router-composer');
const { adapt } = require('../adapters/express-router-adapter');

module.exports = (router) => {
  router.post('/login', adapt(loginRouterComposer.compose()));
};
