const { EmailInUseError } = require('../../../helpers/errors')
const {
  serverError,
  ok,
  badRequest,
  forbidden
} = require('../../../helpers/http')

const signUpController = (validation, addAccount, authentication) => ({
  async handle(req) {
    try {
      const requiredErrorFieldError = validation.validate(req.body)

      if (requiredErrorFieldError) return badRequest(requiredErrorFieldError)

      const { name, email, password } = req.body

      const account = await addAccount.add({ name, email, password })

      if (!account) return forbidden(EmailInUseError())

      const isAuthenticatedAccount = await authentication.auth({
        email,
        password
      })

      return ok(isAuthenticatedAccount)
    } catch (error) {
      return serverError(error)
    }
  }
})

module.exports = signUpController
