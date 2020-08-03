const httpResponse = require('../../helpers/http-response');

const loginRouter = () => {
  return {
    route(httpRequest) {
      if (!httpRequest || !httpRequest.body) {
        return httpResponse().serverError();
      }

      const { email, password } = httpRequest.body;

      if (!email) {
        return httpResponse().badRequest('email');
      }
      if (!password) {
        return httpResponse().badRequest('password');
      }
    },
  };
};

module.exports = loginRouter;
