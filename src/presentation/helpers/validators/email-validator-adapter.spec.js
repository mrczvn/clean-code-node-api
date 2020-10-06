const { default: validator } = require('validator')
const emailValidatorAdapter = require('./email-validator-adapter')

jest.spyOn(validator, 'isEmail').mockReturnValue(true)

const makeSut = () => emailValidatorAdapter()

describe('EmailValidatorAdapter', () => {
  test('Should call validator with correct email', () => {
    const sut = makeSut()

    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid('any_email@mail.com')

    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return false if validator returns false', () => {
    const sut = makeSut()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email@mail.com')

    expect(isValid).toBeFalsy()
  })
})
