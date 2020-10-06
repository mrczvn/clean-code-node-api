const UnauthorizedError = () => {
  const error = new Error('Unauthorized')

  error.name = 'UnauthorizedError'

  return error
}

module.exports = UnauthorizedError
