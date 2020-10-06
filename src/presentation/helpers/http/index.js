const { ServerError, UnauthorizedError } = require('../errors/index')

module.exports = {
  badRequest: (error) => ({ statusCode: 400, body: error }),

  forbidden: (error) => ({ statusCode: 403, body: error }),

  serverError: (error) => ({ statusCode: 500, body: ServerError(error.stack) }),

  unauthorizedError: () => ({ statusCode: 401, body: UnauthorizedError() }),

  ok: (data) => ({ statusCode: 200, body: data })
}
