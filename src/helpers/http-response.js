const missingParamError = require('../util/missing-param-error');
const unauthorizedError = require('../util/unauthorized-error');

const httpResponse = () => {
  return {
    badRequest: (paramName) => {
      return { statusCode: 400, body: missingParamError(paramName) };
    },
    serverError: () => {
      return { statusCode: 500 };
    },
    unauthorizedError: () => {
      return { statusCode: 401, body: unauthorizedError() };
    },
    ok: (data) => {
      return { statusCode: 200, body: data };
    },
  };
};

module.exports = httpResponse;
