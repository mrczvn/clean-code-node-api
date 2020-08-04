const loginRouter = require('./login-router');
const missingParamError = require('../../util/missing-param-error');

const makeSut = () => {
  const AuthUseCaseSpy = () => {
    return {
      auth({ email, password }) {
        this.email = email;
        this.password = password;
      },
    };
  };

  const authUseCaseSpy = AuthUseCaseSpy();

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

  test('Should return 500 if httpResponse has no body', () => {
    const { sut } = makeSut();

    const httpResponse = sut.route({});

    expect(httpResponse.statusCode).toBe(500);
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
});
