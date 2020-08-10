const bcrypt = require('bcrypt');

const encrypter = () => {
  return {
    compare: async ({ value, hash }) => {
      const isValid = await bcrypt.compare(value, hash);

      return isValid;
    },
  };
};

describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = encrypter();

    const value = await sut.compare({
      value: 'any_password',
      hash: 'hashed_password',
    });

    expect(value).toBe(true);
  });

  test('Should return true if bcrypt returns true', async () => {
    const sut = encrypter();

    const value = await sut.compare({
      value: 'invalid_password',
      hash: 'hashed_password',
    });

    expect(value).toBe(false);
  });
});
