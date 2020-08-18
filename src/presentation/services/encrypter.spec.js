jest.mock('bcrypt', () => ({
  async compare(value, hash) {
    this.value = value;
    this.hash = hash;

    return this.isValid;
  },
  isValid: true,
}));

const bcrypt = require('bcrypt');
const encrypter = require('./encrypter');
const { missingParamError } = require('../../util');

const makeSut = () => encrypter();

describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = makeSut();

    const value = await sut.compare({
      value: 'valid_password',
      hash: 'hashed_password',
    });

    expect(value).toBe(true);
  });

  test('Should return false if bcrypt returns false', async () => {
    const sut = makeSut();

    bcrypt.isValid = false;

    const value = await sut.compare({
      value: 'invalid_password',
      hash: 'hashed_password',
    });

    expect(value).toBe(false);
  });

  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut();

    await sut.compare({ value: 'any_password', hash: 'hashed_password' });

    expect(bcrypt.value).toBe('any_password');
    expect(bcrypt.hash).toBe('hashed_password');
  });

  test('Should throw if no params are provided', () => {
    const sut = makeSut();

    expect(sut.compare({})).rejects.toThrow(missingParamError('value'));
    expect(sut.compare({ value: 'any_value' })).rejects.toThrow(
      missingParamError('hash')
    );
  });
});
