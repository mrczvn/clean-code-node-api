const httpResponse = require('../../helpers/http-response');

function loginRouter(authUseCase) {
  return {
    route: (httpRequest) => {
      try {
        const { email, password } = httpRequest.body;

        if (!email) {
          return httpResponse().badRequest('email');
        }
        if (!password) {
          return httpResponse().badRequest('password');
        }

        const accessToken = authUseCase.auth({ email, password });

        if (!accessToken) return httpResponse().unauthorizedError();

        return httpResponse().ok({ accessToken });
      } catch (error) {
        return httpResponse().serverError();
      }
    },
  };
}

module.exports = loginRouter;
