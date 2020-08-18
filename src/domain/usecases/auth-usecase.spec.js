const { missingParamError } = require('../../util');
const authUseCase = require('./auth-usecase');

const makeEncrypter = () => {
  const encrypterSpy = () => {
    return {
      async compare({ value, hash }) {
        const isValid = (val = true) => val;

        if (value !== 'any_password') {
          return isValid(false);
        }

        this.password = value;
        this.hashedPassword = hash;

        return isValid();
      },
      password: '',
      hashedPassword: '',
    };
  };

  return encrypterSpy();
};

const makeEncrypterWithError = () => {
  const encrypterSpy = () => {
    return {
      compare: async () => {
        throw new Error();
      },
    };
  };

  return encrypterSpy();
};

const makeTokenGenerator = () => {
  const tokenGeneratorSpy = () => {
    return {
      async generate(userId) {
        if (userId === 'any_id') {
          this.userId = userId;

          return this.accessToken;
        }
      },
      userId: '',
      accessToken: 'any_token',
    };
  };

  return tokenGeneratorSpy();
};

const makeTokenGeneratorWithError = () => {
  const tokenGeneratorSpy = () => {
    return {
      generate: async () => {
        throw new Error();
      },
    };
  };

  return tokenGeneratorSpy();
};

const makeLoadUserByEmailRepository = () => {
  const loadUserByEmailRepositorySpy = () => {
    return {
      async load(email) {
        this.user.email = email;

        if (email === 'invalid_email@mail.com') return null;

        return this.user;
      },
      user: {
        email: '',
        _id: 'any_id',
        password: 'hashed_password',
      },
    };
  };

  return loadUserByEmailRepositorySpy();
};

const makeLoadUserByEmailRepositoryWithError = () => {
  const loadUserByEmailRepositorySpy = () => {
    return {
      load: async () => {
        throw new Error();
      },
    };
  };

  return loadUserByEmailRepositorySpy();
};

const makeUpdateAccessTokenRepository = () => {
  const updateAccessTokenRepositorySpy = () => {
    return {
      async update({ userId, accessToken }) {
        this.userId = userId;
        this.accessToken = accessToken;
      },
      userId: '',
      accessToken: '',
    };
  };

  return updateAccessTokenRepositorySpy();
};

const makeUpdateAccessTokenRepositoryWithError = () => {
  const updateAccessTokenRepositorySpy = () => {
    return {
      async update() {
        throw new Error();
      },
    };
  };

  return updateAccessTokenRepositorySpy();
};

const makeSut = () => {
  const encrypterSpy = makeEncrypter();
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();
  const tokenGeneratorSpy = makeTokenGenerator();
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository();

  const sut = authUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
  });

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy,
  };
};

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut();

    const promise = sut.auth({});

    expect(promise).rejects.toThrow(missingParamError('email'));
  });

  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut();

    const promise = sut.auth({ email: 'any_email@mail.com' });

    expect(promise).rejects.toThrow(missingParamError('password'));
  });

  test('Should call loadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();

    await sut.auth({ email: 'any_email@mail.com', password: 'any_password' });

    expect(loadUserByEmailRepositorySpy.user.email).toBe('any_email@mail.com');
  });

  test('Should return null if an invalid email is provided', async () => {
    const { sut } = makeSut();

    const accessToken = await sut.auth({
      email: 'invalid_email@mail.com',
      password: 'any_password',
    });

    expect(accessToken).toBeNull();
  });

  test('Should return null if an invalid password is provided', async () => {
    const { sut } = makeSut();

    const accessToken = await sut.auth({
      email: 'any_email@mail.com',
      password: 'invalid_password',
    });

    expect(accessToken).toBeNull();
  });

  test('Should call encrypter with correct values', async () => {
    const { sut, encrypterSpy, loadUserByEmailRepositorySpy } = makeSut();

    await sut.auth({ email: 'any_email@mail.com', password: 'any_password' });

    expect(encrypterSpy.password).toBe('any_password');
    expect(encrypterSpy.hashedPassword).toBe(
      loadUserByEmailRepositorySpy.user.password
    );
  });

  test('Should call tokenGenerator with correct userId', async () => {
    const { sut, tokenGeneratorSpy, loadUserByEmailRepositorySpy } = makeSut();

    await sut.auth({ email: 'any_email@mail.com', password: 'any_password' });

    expect(tokenGeneratorSpy.userId).toBe(
      loadUserByEmailRepositorySpy.user._id
    );
  });

  test('Should return an accessToken if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut();

    const accessToken = await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(accessToken).toBe(tokenGeneratorSpy.accessToken);
    expect(accessToken).toBeTruthy();
  });

  test('Should call updateAccessTokenRepository if correct values', async () => {
    const {
      sut,
      loadUserByEmailRepositorySpy,
      updateAccessTokenRepositorySpy,
      tokenGeneratorSpy,
    } = makeSut();

    await sut.auth({ email: 'any_email@mail.com', password: 'any_password' });

    expect(updateAccessTokenRepositorySpy.userId).toBe(
      loadUserByEmailRepositorySpy.user._id
    );
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(
      tokenGeneratorSpy.accessToken
    );
  });

  test('Should throw if invalid dependencies are provided', async () => {
    const loadUserByEmailRepository = makeLoadUserByEmailRepository();
    const encrypter = makeEncrypter();
    const tokenGenerator = makeTokenGenerator();

    const suts = [
      authUseCase(),
      authUseCase({}),
      authUseCase({ loadUserByEmailRepository: {} }),
      authUseCase({ loadUserByEmailRepository, encrypter: {} }),
      authUseCase({ loadUserByEmailRepository, encrypter }),
      authUseCase({ loadUserByEmailRepository, encrypter, tokenGenerator: {} }),
      authUseCase({ loadUserByEmailRepository, encrypter, tokenGenerator }),
      authUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: {},
      }),
    ];

    suts.forEach((sut) => {
      const promise = sut.auth({
        email: 'any_email@mail.com',
        password: 'any_password',
      });

      expect(promise).rejects.toThrow();
    });
  });

  test('Should throw if any dependencies throws', async () => {
    const loadUserByEmailRepository = makeLoadUserByEmailRepository();
    const encrypter = makeEncrypter();
    const tokenGenerator = makeTokenGenerator();

    const suts = [
      authUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError(),
      }),
      authUseCase({
        loadUserByEmailRepository,
        encrypter: makeEncrypterWithError(),
      }),
      authUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError(),
      }),
      authUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError(),
      }),
    ];

    suts.forEach((sut) => {
      const promise = sut.auth({
        email: 'any_email@mail.com',
        password: 'any_password',
      });

      expect(promise).rejects.toThrow();
    });
  });
});
