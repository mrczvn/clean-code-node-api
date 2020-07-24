const loginRoute = () => {
  return {
    route(httpRequest) {
      if (!httpRequest || !httpRequest.body) {
        return {
          statusCode: 500,
        };
      }
      const { email, password } = httpRequest.body;
      if (!email || !password) {
        return {
          statusCode: 400,
        };
      }
    },
  };
};

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
  });

  test('Should return 500 if httpResponse has no body', () => {
    const sut = loginRoute();
    const httpResponse = sut.route({});

    expect(httpResponse.statusCode).toBe(500);
  });
});
