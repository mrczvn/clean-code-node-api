const validator = require('validator');

const emailValidator = () => {
  return {
    isValid: (email) => validator.isEmail(email),
  };
};

const makeSut = () => emailValidator();

describe('Email Validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = makeSut();

    const isEmailValid = sut.isValid('valid_email@mail.com');

    expect(isEmailValid).toBe(true);
  });

  test('Should return false if validator returns false', () => {
    const sut = makeSut();

    const isEmailValid = sut.isValid('invalid_email@mail.com');

    expect(isEmailValid).toBe(false);
  });
});
