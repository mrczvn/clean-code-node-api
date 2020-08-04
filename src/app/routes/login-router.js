const httpResponse = require('../../helpers/http-response');

function loginRouter(authUseCase) {
  // this.authUseCase = authUseCase;

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
    },
  };
}

module.exports = loginRouter;
