const jwt = require('jsonwebtoken');

const tokenGenerator = () => {
  return {
    generate: (id) => {
      return jwt.sign(id, 'secret');
    },
  };
};

const makeSut = () => tokenGenerator();

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

  test('Should return token if JWT returns token', async () => {
    const sut = makeSut();

    const accessToken = await sut.generate('any_id');

    expect(accessToken).toBe(jwt.token);
  });
});
