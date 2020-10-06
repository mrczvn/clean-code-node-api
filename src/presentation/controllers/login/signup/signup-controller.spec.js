const signUpController = require('./signup-controller')
const {
  badRequest,
  serverError,
  missingParamError
} = require('./signup-controller-protocols')
const {
  AddAccountSpy,
  AuthenticationSpy,
  ValidationSpy
} = require('../../../test')

const mockRequest = () => ({
  body: { name: 'any_name', email: 'any_email', password: 'any_password' }
})

const throwError = () => {
  throw new Error()
}

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

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()

    validationSpy.error = missingParamError('any_field')

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  test('Should return 400 if Validation throws', async () => {
    const { sut, validationSpy } = makeSut()

    jest.spyOn(validationSpy, 'validate').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
