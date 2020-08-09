const { missingParamError } = require('../../util');
const authUseCase = require('./auth-usecase');

const makeEncrypter = () => {
  const encrypterSpy = () => {
    return {
      compare: async ({ hashedPassword }) => {
        return hashedPassword;
      },
    };
  };

  return encrypterSpy();
};

const makeTokenGenerator = () => {
  const tokenGeneratorSpy = () => {
    return {
      generate: async (userId) => {
        if (userId === 'any_id') return { accessToken: 'any_token', userId };
        return null;
      },
    };
  };

  return tokenGeneratorSpy();
};

const makeLoadUserByEmailRepository = () => {
  const loadUserByEmailRepositorySpy = () => {
    return {
      load: async ({ email, password }) => {
        const isValid = (value) => {
          return {
            id: 'any_id',
            accessToken: value,
            email,
            hashedPassword: 'hashed_password',
            password,
          };
        };

        if (
          email === 'invalid_email@mail.com' ||
          password === 'invalid_password'
        )
          return null;

        return isValid(true);
      },
    };
  };

  return loadUserByEmailRepositorySpy();
};

const makeSut = () => {
  const encrypterSpy = makeEncrypter();
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();
  const tokenGeneratorSpy = makeTokenGenerator();

  const sut = authUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
  });

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
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
    const sut = authUseCase({});

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

  test('Should return null if an invalid email is provided', async () => {
    const { sut } = makeSut();

    const { accessToken } = await sut.auth({
      email: 'invalid_email@mail.com',
      password: 'any_password',
    });

    expect(accessToken).toBeNull();
  });

  test('Should return null if an invalid password is provided', async () => {
    const { sut } = makeSut();

    const { accessToken } = await sut.auth({
      email: 'invalid_email@mail.com',
      password: 'invalid_password',
    });

    expect(accessToken).toBeNull();
  });

  test('Should call encrypter with correct values', async () => {
    const { sut } = makeSut();

    const { hashedPassword, password } = await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(password).toBe('any_password');
    expect(hashedPassword).toBe('hashed_password');
  });

  test('Should call tokenGenerator with correct userId', async () => {
    const { sut } = makeSut();

    const { userId } = await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(userId).toBe('any_id');
  });

  test('Should return an accessToken if correct credentials are provided', async () => {
    const { sut } = makeSut();

    const { accessToken } = await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(accessToken).toBe('any_token');
    expect(accessToken).toBeTruthy();
  });
});
