const ServerError = (stack) => {
  const error = new Error('Internal server error')

  error.stack = stack
  error.name = 'ServerError'

  return error
}

module.exports = ServerError
