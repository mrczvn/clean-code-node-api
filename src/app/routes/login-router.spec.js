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
        const isValidated = (token) => {
          return { accessToken: token, email, password };
        };

        if (email === 'invalid_email@mail.com') return isValidated(null);

        return isValidated('any_token');
      },
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
  const emailValidatorSpy = (validated = true) => {
    return {
      isValid(email) {
        const isValidated = (value) => value;

        if (validated) return isValidated(true);

        return isValidated(false);
      },
    };
  };

  return emailValidatorSpy;
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
    emailValidator: emailValidatorSpy(),
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

  test('Should return 500 if httpRequest is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.route();

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });

  test('Should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.route({});

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });

  test('Should call authUseCase with correct params', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.email).toBe(httpRequest.body.email);
    expect(httpResponse.password).toBe(httpRequest.body.password);
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
    const { sut } = makeSut();

    const accessToken = 'any_token';

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const { httpResponse } = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(accessToken);
  });

  test('Should return 500 if no authUseCase is provided', async () => {
    const sut = loginRouter({});

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });

  test('Should return 500 if authUseCase has no auth method', async () => {
    const sut = loginRouter({ authUseCase: {} });

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });

  test('Should return 500 if authUseCase throws', async () => {
    const authUseCaseSpy = makeAuthUseCaseWithError();

    const sut = loginRouter({ authUseCase: authUseCaseSpy });

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  test('Should return 400 if an invalid no email is provided', async () => {
    const { emailValidatorSpy, authUseCaseSpy } = makeSut();

    const sut = loginRouter({
      authUseCase: authUseCaseSpy,
      emailValidator: emailValidatorSpy(false),
    });

    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(invalidParamError('email'));
  });

  test('Should return 500 if no emailValidator is provided', async () => {
    const { authUseCaseSpy } = makeSut();

    const sut = loginRouter({ authUseCase: authUseCaseSpy });

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });

  test('Should return 500 if no emailValidator has no isValid method', async () => {
    const { authUseCaseSpy } = makeSut();

    const sut = loginRouter({
      authUseCase: authUseCaseSpy,
      emailValidator: {},
    });

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });

  test('Should return 500 if emailValidator throws', async () => {
    const { authUseCaseSpy } = makeSut();

    const emailValidatorSpy = makeEmailValidatorWithError();

    const sut = loginRouter({
      authUseCase: authUseCaseSpy,
      emailValidator: emailValidatorSpy,
    });

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  test('Should call emailValidator with correct email', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.email).toBe(httpRequest.body.email);
  });
});
