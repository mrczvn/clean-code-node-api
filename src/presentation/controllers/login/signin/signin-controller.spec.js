const signInController = require('./signin-controller')
const {
  badRequest,
  missingParamError
} = require('./signin-controller-protocols')
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

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()

    validationSpy.error = missingParamError('any_field')

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })
})
