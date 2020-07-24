const loginRoute = () => {
  return {
    route(httpRequest) {
      if (!httpRequest.body.email || !httpRequest.body.password) {
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
});

describe('Login Route', () => {
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
});