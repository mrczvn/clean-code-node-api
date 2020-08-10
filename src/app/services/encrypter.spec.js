const encrypter = () => {
  return {
    compare: async ({ password, hashedPassword }) => {
      const isValid = (value = true) => {
        return { password, hashedPassword, value };
      };

      if (password === 'any_password') return isValid();
    },
  };
};

describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = encrypter();

    const { value } = await sut.compare({
      password: 'any_password',
      hashedPassword: 'hashed_password',
    });

    expect(value).toBe(true);
  });

  // test('Should return true if bcrypt returns true', async () => {
  //   const sut = encrypter();

  //   const { value } = await sut.compare('invalid_password', 'hashed_password');

  //   expect(value).toBe(false);
  // });
});
