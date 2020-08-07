const { missingParamError } = require('../../util');

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

const makeSut = () => {
  const LoadUserByEmailRepositorySpy = () => {
    return {
      load: async (email) => email,
    };
  };

  const loadUserByEmailRepository = LoadUserByEmailRepositorySpy();

  const sut = authUseCase(loadUserByEmailRepository);

  return {
    sut,
    loadUserByEmailRepository,
  };
};

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut();

    const promise = sut.auth({});

    expect(promise).rejects.toThrow(missingParamError('email'));
  });

  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut();

    const promise = sut.auth({ email: 'any_email@mail.com' });

    expect(promise).rejects.toThrow(missingParamError('password'));
  });

  test('Should call loadUserByEmailRepository with correct email', async () => {
    const { sut } = makeSut();

    const res = await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(res).toBe('any_email@mail.com');
  });
});
