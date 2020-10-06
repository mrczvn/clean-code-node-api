const bcrypt = require('bcrypt')
const bcryptAdapter = require('./bcrypt-adapter')

jest.spyOn(bcrypt, 'hash').mockResolvedValue('hash')

const makeSut = () => {
  const salt = 12

  const sut = bcryptAdapter(salt)

  return { sut, salt }
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const { sut, salt } = makeSut()

      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.hash('any_value')

      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should throw if hash throws', async () => {
      const { sut } = makeSut()

      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error()
      })

      const hash = sut.hash('any_value')

      await expect(hash).rejects.toThrow()
    })

    test('Should return a valid hash on hash success', async () => {
      const { sut } = makeSut()

      const hash = await sut.hash('any_value')

      expect(hash).toBe('hash')
    })
  })
})
