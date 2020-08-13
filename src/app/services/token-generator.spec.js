const jwt = require('jsonwebtoken');
const tokenGenerator = require('./token-generator');
const { missingParamError } = require('../../util');

const makeSut = () => tokenGenerator('secret');

describe('Token Generator', () => {
  test('Should return null if JWT returns null', async () => {
    const sut = makeSut();

    const accessToken = await sut.generate('any_i');

    expect(accessToken).toBeNull();
  });

  test('Should return token if JWT returns token', async () => {
    const sut = makeSut();

    const accessToken = await sut.generate('any_id');

    expect(accessToken).toBe(jwt.token);
  });

  test('Should call JWT with correct values', async () => {
    const sut = makeSut();

    await sut.generate('any_id');

    expect(jwt.id).toBe('any_id');
    expect(jwt.secret).toBe('secret');
  });

  test('Should throw if no secret is provided', () => {
    const sut = tokenGenerator();

    const promise = sut.generate('any_id');

    expect(promise).rejects.toThrow(missingParamError('secret'));
  });

  test('Should throw if no id is provided', () => {
    const sut = makeSut();

    const promise = sut.generate();

    expect(promise).rejects.toThrow(missingParamError('id'));
  });
});
