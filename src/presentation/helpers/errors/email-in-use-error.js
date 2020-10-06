const EmailInUseError = () => {
  const error = new Error('E-mail já existente')

  error.name = 'EmailInUseError'

  return error
}

module.exports = EmailInUseError
