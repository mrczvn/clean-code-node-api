const httpResponse = require('../helpers/http-response');
const { missingParamError, invalidParamError } = require('../../util');

function loginRouter({ authUseCase, emailValidator }) {
  return {
    route: async (httpRequest) => {
      try {
        const { email, password } = httpRequest.body;

        if (!email)
          return httpResponse().badRequest(missingParamError('email'));

        if (!emailValidator.isValid(email))
          return httpResponse().badRequest(invalidParamError('email'));

        if (!password)
          return httpResponse().badRequest(missingParamError('password'));

        const authUseCaseResolved = await authUseCase.auth({ email, password });

        const { accessToken } = authUseCaseResolved;

        if (!accessToken) return httpResponse().unauthorizedError();

        return {
          httpResponse: httpResponse().ok({ accessToken }),
          email: authUseCaseResolved.email,
          password: authUseCaseResolved.password,
        };
      } catch (error) {
        return httpResponse().serverError();
      }
    },
  };
}

module.exports = loginRouter;
