const signUpController = require('./signup-controller')
const {
  AddAccountSpy,
  AuthenticationSpy,
  ValidationSpy
} = require('../../../test')

const mockRequest = () => ({
  body: { name: 'any_name', email: 'any_email', password: 'any_password' }
})

const makeSut = () => {
  const validationSpy = ValidationSpy()
  const addAccountSpy = AddAccountSpy()
  const authenticationSpy = AuthenticationSpy()

  const sut = signUpController(validationSpy, addAccountSpy, authenticationSpy)

  return { sut, validationSpy, addAccountSpy, authenticationSpy }
}

describe('SignUp Controller', () => {
  const mockFakeRequest = mockRequest()

  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()

    await sut.handle(mockFakeRequest)

    expect(validationSpy.input).toEqual(mockFakeRequest.body)
  })
})
