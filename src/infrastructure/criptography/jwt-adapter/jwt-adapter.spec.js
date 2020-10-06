const jwt = require('jsonwebtoken')
const jwtAdapter = require('./jwt-adapter')

jest.spyOn(jwt, 'sign').mockReturnValue('any_token')
jest.spyOn(jwt, 'verify').mockReturnValue('any_value')

const makeSut = () => {
  const secret = 'TOP_SECRET'

  const sut = jwtAdapter(secret)

  return { sut, secret }
}

describe('Jwt Adapter', () => {
  describe('encrypt()', () => {
    test('Should call sign with correct values', () => {
      const { sut, secret } = makeSut()

      const signSpy = jest.spyOn(jwt, 'sign')

      sut.encrypt('any_value')

      expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, secret)
    })

    test('Should return a token on sign success', () => {
      const { sut } = makeSut()

      const token = sut.encrypt('any_value')

      expect(token).toBe('any_token')
    })
  })

  describe('decrypt()', () => {
    test('Should call verify with correct values', () => {
      const { sut, secret } = makeSut()

      const verifySpy = jest.spyOn(jwt, 'verify')

      sut.decrypt('any_token')

      expect(verifySpy).toHaveBeenCalledWith('any_token', secret)
    })
  })
})
