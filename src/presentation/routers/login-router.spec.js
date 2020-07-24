const loginRoute = () => {
  return {
    route(httpRequest) {
      if (!httpRequest || !httpRequest.body) {
        return httpResponse().serverError();
      }
      const { email, password } = httpRequest.body;
      if (!email) {
        return httpResponse().badRequest('email');
      }
      if (!password) {
        return httpResponse().badRequest('password');
      }
    },
  };
};

const httpResponse = () => {
  return {
    badRequest(paramName) {
      return { statusCode: 400, body: missingParamError(paramName) };
    },
    serverError() {
      return { statusCode: 500 };
    },
  };
};

const missingParamError = (paramName) => Error(`Missing param: ${paramName}`);

describe('Login Route', () => {
  test('Should return 400 if no email is provided', () => {
    const sut = loginRoute();

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
    const sut = loginRoute();
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
    const sut = loginRoute();
    const httpResponse = sut.route({});

    expect(httpResponse.statusCode).toBe(500);
  });
});
