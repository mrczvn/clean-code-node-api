const missingParamError = (paramName) =>
  new Error(`Missing param: ${paramName}`)

module.exports = missingParamError
