const loginRouter = require('./login-router');

const {
  missingParamError,
  unauthorizedError,
  invalidParamError,
  serverError,
} = require('../../util');

const makeAuthUseCase = () => {
  const authUseCaseSpy = () => {
    return {
      async auth({ email, password }) {
        const isValidated = (token) => token;

        this.email = email;
        this.password = password;

        if (email !== 'valid_email@mail.com') return isValidated(null);

        return isValidated(this.accessToken);
      },
      email: '',
      password: '',
      accessToken: 'any_token',
    };
  };

  return authUseCaseSpy();
};

const makeAuthUseCaseWithError = () => {
  const authUseCaseSpy = () => {
    return {
      auth: async () => {
        throw new Error();
      },
    };
  };

  return authUseCaseSpy();
};

const makeEmailValidator = () => {
  const emailValidatorSpy = () => {
    return {
      isValid(email) {
        this.email = email;

        const isValidated = (value) => value;

        if (email === 'invalid_emailmail.com') return isValidated(false);

        return isValidated(true);
      },
      email: '',
    };
  };

  return emailValidatorSpy();
};

const makeEmailValidatorWithError = () => {
  const emailValidatorSpy = () => {
    return {
      isValid: () => {
        throw new Error();
      },
    };
  };

  return emailValidatorSpy();
};

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase();

  const emailValidatorSpy = makeEmailValidator();

  const sut = loginRouter({
    authUseCase: authUseCaseSpy,
    emailValidator: emailValidatorSpy,
  });

  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy,
  };
};

describe('Login Route', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(missingParamError('email'));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(missingParamError('password'));
  });

  test('Should return 400 if an invalid no email is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'invalid_emailmail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(invalidParamError('email'));
  });

  test('Should call authUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    await sut.route(httpRequest);

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test('Should return 401 when invalid credentials are provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'invalid_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(unauthorizedError());
  });

  test('Should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut();

    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'valid_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });

  test('Should return 500 if loginRouter is invalid dependencies are provided', () => {
    const authUseCase = makeAuthUseCase();

    const suts = [
      loginRouter(),
      loginRouter({ authUseCase: {} }),
      loginRouter({ authUseCase }),
      loginRouter({ authUseCase, emailValidator: {} }),
    ];

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    suts.forEach(async (sut) => {
      const httpResponse = await sut.route(httpRequest);

      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body).toEqual(serverError());
    });
  });

  test('Should return 500 if httpRequest is invalid dependencies are provided', () => {
    const { sut } = makeSut();
    const suts = [sut.route(), sut.route({})];

    suts.forEach(async (s) => {
      const httpResponse = await s;

      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body).toEqual(serverError());
    });
  });

  test('Should return 500 if authUseCase throws', () => {
    const authUseCase = makeAuthUseCaseWithError();
    const emailValidator = makeEmailValidatorWithError();

    const suts = [
      loginRouter({ authUseCase }),
      loginRouter({ authUseCase, emailValidator }),
    ];

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    suts.forEach(async (sut) => {
      const httpResponse = await sut.route(httpRequest);

      expect(httpResponse.statusCode).toBe(500);
    });
  });

  test('Should call emailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    await sut.route(httpRequest);

    expect(emailValidatorSpy.email).toBe(httpRequest.body.email);
  });
});
