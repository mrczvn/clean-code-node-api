const bcrypt = require('bcrypt');

const encrypter = () => {
  return {
    compare: async ({ value, hash }) => {
      const isValid = await bcrypt.compare(value, hash);

      return isValid;
    },
  };
};

const makeSut = () => {
  return encrypter();
};

describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = makeSut();

    const value = await sut.compare({
      value: 'any_password',
      hash: 'hashed_password',
    });

    expect(value).toBe(true);
  });

  test('Should return true if bcrypt returns true', async () => {
    const sut = makeSut();

    const value = await sut.compare({
      value: 'invalid_password',
      hash: 'hashed_password',
    });

    expect(value).toBe(false);
  });

  test('Should return true if bcrypt returns true', async () => {
    const sut = makeSut();

    await sut.compare({ value: 'any_password', hash: 'hashed_password' });

    expect(bcrypt.value).toBe('any_password');
    expect(bcrypt.hash).toBe('hashed_password');
  });
});
