const loginRouter = require('./login-router');
const missingParamError = require('../../util/missing-param-error');

const makeSut = () => loginRouter();

describe('Login Route', () => {
  test('Should return 400 if no email is provided', () => {
    const sut = makeSut();

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
    const sut = makeSut();

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
    const sut = makeSut();

    const httpResponse = sut.route({});

    expect(httpResponse.statusCode).toBe(500);
  });

  test('Should call authUseCase with correct params', () => {
    const sut = loginRouter();

    const httpResponse = sut.route({});

    expect(httpResponse.statusCode).toBe(500);
  });
});
