jest.mock('jsonwebtoken', () => ({
  sign({ _id }, secret) {
    if (_id !== 'any_id') return null;

    this.id = _id;
    this.secret = secret;

    return this.token;
  },
  token: 'any_token',
  id: '',
  secret: '',
}));

const jwt = require('jsonwebtoken');
const tokenGenerator = require('./token-generator');
const { missingParamError } = require('../../util');

const makeSut = () => tokenGenerator('secret');

describe('Token Generator', () => {
  test('Should return null if JWT returns null', () => {
    const sut = makeSut();

    const accessToken = sut.generate('any_i');

    expect(accessToken).toBeNull();
  });

  test('Should return token if JWT returns token', () => {
    const sut = makeSut();

    const accessToken = sut.generate('any_id');

    expect(accessToken).toBe(jwt.token);
  });

  test('Should call JWT with correct values', () => {
    const sut = makeSut();

    sut.generate('any_id');

    expect(jwt.id).toBe('any_id');
    expect(jwt.secret).toBe('secret');
  });

  test('Should throw if no secret is provided', () => {
    const sut = tokenGenerator();

    const promise = sut.generate('any_id');

    expect(promise).toEqual(missingParamError('secret'));
  });

  test('Should throw if no id is provided', () => {
    const sut = makeSut();

    const promise = sut.generate();

    expect(promise).toEqual(missingParamError('id'));
  });
});
