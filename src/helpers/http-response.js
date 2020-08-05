const { unauthorizedError, serverError } = require('../util');

const httpResponse = () => {
  return {
    badRequest: (error) => {
      return { statusCode: 400, body: error };
    },
    serverError: () => {
      return { statusCode: 500, body: serverError() };
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
