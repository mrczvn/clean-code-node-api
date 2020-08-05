const httpResponse = require('../../helpers/http-response');
const missingParamError = require('../../util/missing-param-error');
const invalidParamError = require('../../util/invalid-param-error');

function loginRouter({ authUseCase, emailValidator }) {
  return {
    route: async (httpRequest) => {
      try {
        const { email, password } = httpRequest.body;

        if (!email) {
          return httpResponse().badRequest(missingParamError('email'));
        }

        if (!emailValidator.isValid(email)) {
          return httpResponse().badRequest(invalidParamError('email'));
        }

        if (!password) {
          return httpResponse().badRequest(missingParamError('password'));
        }

        const accessToken = await authUseCase.auth({ email, password });

        if (!accessToken) return httpResponse().unauthorizedError();

        return httpResponse().ok({ accessToken });
      } catch (error) {
        return httpResponse().serverError();
      }
    },
  };
}

module.exports = loginRouter;
