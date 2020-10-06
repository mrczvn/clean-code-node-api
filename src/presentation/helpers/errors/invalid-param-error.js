const invalidParamError = (paramName) =>
  new Error(`Invalid param: ${paramName}`)

module.exports = invalidParamError
