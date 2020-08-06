const emailValidator = () => {
  return {
    isValid: (email) => {
      return true;
    },
  };
};

describe('Email Validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = emailValidator();

    const isEmailValid = sut.isValid('valid_email@mail.com');

    expect(isEmailValid).toBe(true);
  });
});
