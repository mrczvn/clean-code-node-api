const { default: validator } = require('validator')

const emailValidatorAdapter = () => ({
  isValid: (email) => validator.isEmail(email)
})

module.exports = emailValidatorAdapter
