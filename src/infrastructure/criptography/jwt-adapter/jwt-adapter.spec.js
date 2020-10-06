const jwt = require('jsonwebtoken')
const jwtAdapter = require('./jwt-adapter')

jest.spyOn(jwt, 'sign').mockReturnValue('any_token')

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
})
