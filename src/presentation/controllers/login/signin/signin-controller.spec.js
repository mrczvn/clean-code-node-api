const signInController = require('./signin-controller')
const { AuthenticationSpy, ValidationSpy } = require('../../../test')

const mockRequest = () => ({
  body: { email: 'any_email', password: 'any_password' }
})

const makeSut = () => {
  const validationSpy = ValidationSpy()
  const authenticationSpy = AuthenticationSpy()

  const sut = signInController(validationSpy, authenticationSpy)

  return { sut, validationSpy, authenticationSpy }
}

describe('SignIn Controller', () => {
  const mockFakeRequest = mockRequest()

  test('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()

    await sut.handle(mockFakeRequest)

    expect(validationSpy.input).toEqual(mockFakeRequest.body)
  })
})
