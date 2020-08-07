const { missingParamError } = require('../../util');

const authUseCase = () => {
  return {
    auth: async ({
      email = missingParamError('email'),
      password = missingParamError('password'),
    }) => {},
  };
};

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const sut = authUseCase();

    const promise = sut.auth({});

    expect(promise).rejects.toThrow(missingParamError('email'));
  });

  test('Should throw if no email is provided', async () => {
    const sut = authUseCase();

    const promise = sut.auth({ email: 'any_email@mail.com' });

    expect(promise).rejects.toThrow(missingParamError('password'));
  });
});
