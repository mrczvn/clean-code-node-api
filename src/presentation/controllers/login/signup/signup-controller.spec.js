const signUpController = require('./signup-controller')
const {
  badRequest,
  serverError,
  missingParamError,
  forbidden,
  EmailInUseError,
  ok
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

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()

    await sut.handle(mockFakeRequest)

    expect(addAccountSpy.addAccountParams).toEqual(mockFakeRequest.body)
  })

  test('Should return 401 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut()

    addAccountSpy.account = null

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(forbidden(EmailInUseError()))
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut()

    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()

    const { email, password } = mockFakeRequest.body

    await sut.handle(mockFakeRequest)

    expect(authenticationSpy.authenticationParams).toEqual({ email, password })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()

    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)

    const httpRequest = await sut.handle(mockFakeRequest)

    expect(httpRequest).toEqual(serverError(new Error()))
  })

  test('Should return 200 an account on success', async () => {
    const { sut, authenticationSpy } = makeSut()

    const httpRequest = await sut.handle(mockFakeRequest)

    expect(httpRequest).toEqual(ok(authenticationSpy.account))
  })
})
