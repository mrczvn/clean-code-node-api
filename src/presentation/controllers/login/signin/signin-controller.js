const {
  serverError,
  unauthorizedError,
  ok,
  badRequest
} = require('./signin-controller-protocols')

const signInController = (validation, authentication) => ({
  async handle(req) {
    try {
      const requiredErrorFieldError = validation.validate(req.body)

      if (requiredErrorFieldError) return badRequest(requiredErrorFieldError)

      const { email, password } = req.body

      const isAuthenticatedAccount = await authentication.auth({
        email,
        password
      })

      if (!isAuthenticatedAccount) return unauthorizedError()

      return ok(isAuthenticatedAccount)
    } catch (error) {
      return serverError(error)
    }
  }
})

module.exports = signInController
