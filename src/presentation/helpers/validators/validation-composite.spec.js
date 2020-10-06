const validationComposite = require('./validation-composite')
const { validationSpy } = require('../../test')
const { missingParamError } = require('../errors')

const makeSut = () => {
  const validationSpies = [validationSpy(), validationSpy()]

  const sut = validationComposite(validationSpies)

  return { sut, validationSpies }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationSpies } = makeSut()

    validationSpies[0].error = missingParamError('any_field')

    const error = sut.validate({ field: 'any_field' })

    expect(error).toEqual(missingParamError('any_field'))
  })

  test('Should return the first error if more then one validation fails', () => {
    const { sut, validationSpies } = makeSut()

    validationSpies[0].error = new Error()
    validationSpies[1].error = missingParamError('any_field')

    const error = sut.validate({ field: 'any_field' })

    expect(error).toEqual(new Error())
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()

    const error = sut.validate({ field: 'any_field' })

    expect(error).toBeNull()
  })
})
