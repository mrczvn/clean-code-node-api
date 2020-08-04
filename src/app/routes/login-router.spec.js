const loginRouter = require('./login-router');
const missingParamError = require('../../util/missing-param-error');
const unauthorizedError = require('../../util/unauthorized-error');
const serverError = require('../../util/server-error');

const makeAuthUseCase = () => {
  const authUseCaseSpy = () => {
    return {
      auth({ email, password }) {
        this.email = email;
        this.password = password;

        return this.accessToken;
      },
    };
  };

  return authUseCaseSpy();
};

const makeAuthUseCaseWithError = () => {
  const authUseCaseSpy = () => {
    return {
      auth: () => {
        throw new Error();
      },
    };
  };

  return authUseCaseSpy();
};

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase();

  authUseCaseSpy.accessToken = 'any_token';

  const sut = loginRouter(authUseCaseSpy);

  return {
    sut,
    authUseCaseSpy,
  };
};

describe('Login Route', () => {
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(missingParamError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(missingParamError('password'));
  });

  test('Should return 500 if httpRequest is provided', () => {
    const { sut } = makeSut();

    const httpResponse = sut.route();

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });

  test('Should return 500 if httpRequest has no body', () => {
    const { sut } = makeSut();

    const httpResponse = sut.route({});

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });

  test('Should call authUseCase with correct params', () => {
    const { sut, authUseCaseSpy } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };

    sut.route(httpRequest);

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test('Should return 401 when invalid credentials are provided', () => {
    const { sut, authUseCaseSpy } = makeSut();

    authUseCaseSpy.accessToken = null;

    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_password',
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(unauthorizedError());
  });

  test('Should return 200 when valid credentials are provided', () => {
    const { sut, authUseCaseSpy } = makeSut();

    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'valid_password',
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });

  test('Should return 500 if no authUseCase is provided', () => {
    const sut = loginRouter();

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });

  test('Should return 500 if authUseCase has no auth method', () => {
    const sut = loginRouter({});

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });

  test('Should return 500 if authUseCase throws', () => {
    const authUseCaseSpy = makeAuthUseCaseWithError();

    const sut = loginRouter(authUseCaseSpy);

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });
});
