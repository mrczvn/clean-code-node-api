const { missingParamError } = require('../../util');

const LoadUserByEmailRepositorySpy = () => {
  return {
    load: async (email) => email,
  };
};

const authUseCase = (loadUserByEmailRepository) => {
  return {
    auth: async ({ email, password }) => {
      if (!email) return missingParamError('email');

      if (!password) return missingParamError('password');

      const response = await loadUserByEmailRepository.load(email);

      return response;
    },
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

  test('Should call loadUserByEmailRepository with correct email', async () => {
    const loadUserByEmailRepositorySpy = LoadUserByEmailRepositorySpy();

    const sut = authUseCase(loadUserByEmailRepositorySpy);

    const res = await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(res).toBe('any_email@mail.com');
  });
});
