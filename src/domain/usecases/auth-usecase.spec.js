const { missingParamError } = require('../../util');
const authUseCase = require('./auth-usecase');

const makeSut = () => {
  const LoadUserByEmailRepositorySpy = () => {
    return {
      load: async (email) => {
        const isValid = (value) => {
          return { accessToken: value, email };
        };

        if (email === 'invalid_email@mail.com') return isValid(null);

        return isValid(true);
      },
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

    const { email } = await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(email).toBe('any_email@mail.com');
  });

  test('Should throw if no loadUserByEmailRepository is provided', async () => {
    const sut = authUseCase();

    const promise = sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(promise).rejects.toThrow();
  });

  test('Should throw if loadUserByEmailRepository has no load method', async () => {
    const sut = authUseCase({});

    const promise = sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(promise).rejects.toThrow();
  });

  test('Should return null if loadUserByEmailRepository returns null', async () => {
    const { sut } = makeSut();

    const accessToken = await sut.auth({
      email: 'invalid_email@mail.com',
      password: 'any_password',
    });

    expect(accessToken).toBeNull();
  });
});
