const bcrypt = require('bcrypt')
const bcryptAdapter = require('./bcrypt-adapter')

jest.spyOn(bcrypt, 'hash').mockResolvedValue('hash')
jest.spyOn(bcrypt, 'compare').mockResolvedValue(true)

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

  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const { sut } = makeSut()

      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare({ plaintext: 'any_value', digest: 'any_hash' })

      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return false when compare fails', async () => {
      const { sut } = makeSut()

      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false)

      const isValid = await sut.compare({
        plaintext: 'any_value',
        digest: 'any_hash'
      })

      expect(isValid).toBeFalsy()
    })

    test('Should throw if compare throws', async () => {
      const { sut } = makeSut()

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        throw new Error()
      })

      const isValid = sut.compare('any_value', 'any_hash')

      await expect(isValid).rejects.toThrow()
    })

    test('Should return true when compare succeeds', async () => {
      const { sut } = makeSut()

      const isValid = await sut.compare({
        plaintext: 'any_value',
        digest: 'any_hash'
      })

      expect(isValid).toBeTruthy()
    })
  })
})
