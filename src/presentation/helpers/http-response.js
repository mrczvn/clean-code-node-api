const { unauthorizedError, serverError } = require('../../util');

const httpResponse = () => {
  return {
    badRequest: (error) => {
      return { statusCode: 400, body: { error: error.message } };
    },
    serverError: () => {
      return { statusCode: 500, body: { error: serverError().message } };
    },
    unauthorizedError: () => {
      return { statusCode: 401, body: { error: unauthorizedError().message } };
    },
    ok: (data) => {
      return { statusCode: 200, body: data };
    },
  };
};

module.exports = httpResponse();
