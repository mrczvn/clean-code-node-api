const emailValidator = require('./email-validator');
const { missingParamError } = require('../../util');

const makeSut = () => emailValidator();

describe('Email Validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = makeSut();

    const isEmailValid = sut.isValid('any_email@mail.com');

    expect(isEmailValid.value).toBe(true);
  });

  test('Should return false if validator returns false', () => {
    const sut = makeSut();

    const isEmailValid = sut.isValid('invalid_email@mail.com');

    expect(isEmailValid.value).toBe(false);
  });

  test('Should call validator with correct ', () => {
    const sut = makeSut();

    const isEmailValid = sut.isValid('any_email@mail.com');

    expect(isEmailValid.email).toBe('any_email@mail.com');
  });

  test('Should throw if no is provided', async () => {
    const sut = makeSut();

    expect(() => sut.isValid()).toThrow(missingParamError('email'));
  });
});
