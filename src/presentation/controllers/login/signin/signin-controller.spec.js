const signInController = require('./signin-controller')
const {
  badRequest,
  missingParamError,
  serverError
} = require('./signin-controller-protocols')
const { AuthenticationSpy, ValidationSpy } = require('../../../test')

const mockRequest = () => ({
  body: { email: 'any_email', password: 'any_password' }
})

const throwError = () => {
  throw new Error()
}

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

  test('Should return 500 if Validation throws', async () => {
    const { sut, validationSpy } = makeSut()

    jest.spyOn(validationSpy, 'validate').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()

    const { email, password } = mockFakeRequest.body

    await sut.handle(mockFakeRequest)

    expect(authenticationSpy.authenticationParams).toEqual({ email, password })
  })
})
