const httpResponse = require('../../helpers/http-response');

function loginRouter(authUseCase) {
  return {
    route: (httpRequest) => {
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

      authUseCase.auth({ email, password });

      return {
        statusCode: 401,
      };
    },
  };
}

module.exports = loginRouter;
