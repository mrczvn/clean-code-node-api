const missingParamError = require('./missing-param-error');

const httpResponse = () => {
  return {
    badRequest(paramName) {
      return { statusCode: 400, body: missingParamError(paramName) };
    },
    serverError() {
      return { statusCode: 500 };
    },
  };
};

module.exports = httpResponse;
