const loginRouter = require('../app/routers/user');
const missingParamError = require('../helpers/missing-param-error');

describe('Login Route', () => {
  test('Should return 400 if no email is provided', () => {
    const sut = loginRouter();

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
    const sut = loginRouter();

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
    const sut = loginRouter();
    const httpResponse = sut.route({});

    expect(httpResponse.statusCode).toBe(500);
  });
});
