const loginRouter = require("./login-router");
const missingParamError = require("../../util/missing-param-error");
const unauthorizedError = require("../../util/unauthorized-error");
const invalidParamError = require("../../util/invalid-param-error");
const serverError = require("../../util/server-error");

const makeAuthUseCase = () => {
  const AuthUseCaseSpy = () => {
    return {
      async auth({ email, password }) {
        this.email = email;
        this.password = password;

        return this.accessToken;
      },
    };
  };
  const authUseCaseSpy = AuthUseCaseSpy();

  authUseCaseSpy.accessToken = "any_token";

  return authUseCaseSpy;
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
  const EmailValidatorSpy = () => {
    return {
      isValid(email) {
        return this.isEmailValid;
      },
    };
  };

  const emailValidatorSpy = EmailValidatorSpy();

  emailValidatorSpy.isEmailValid = true;

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
    emailValidator: emailValidatorSpy,
  });

  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy,
  };
};

describe("Login Route", () => {
  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        password: "any_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(missingParamError("email"));
  });

  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: "any_email@email.com",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(missingParamError("password"));
  });

  test("Should return 500 if httpRequest is provided", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.route();

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });

  test("Should return 500 if httpRequest has no body", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.route({});

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });

  test("Should call authUseCase with correct params", async () => {
    const { sut, authUseCaseSpy } = makeSut();

    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };

    await sut.route(httpRequest);

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test("Should return 401 when invalid credentials are provided", async () => {
    const { sut, authUseCaseSpy } = makeSut();

    authUseCaseSpy.accessToken = null;

    const httpRequest = {
      body: {
        email: "invalid_email@email.com",
        password: "invalid_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(unauthorizedError());
  });

  test("Should return 200 when valid credentials are provided", async () => {
    const { sut, authUseCaseSpy } = makeSut();

    const httpRequest = {
      body: {
        email: "valid_email@email.com",
        password: "valid_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });

  test("Should return 500 if no authUseCase is provided", async () => {
    const sut = loginRouter({});

    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });

  test("Should return 500 if authUseCase has no auth method", async () => {
    const sut = loginRouter({ authUseCase: {} });

    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });

  test("Should return 500 if authUseCase throws", async () => {
    const authUseCaseSpy = makeAuthUseCaseWithError();

    const sut = loginRouter({ authUseCase: authUseCaseSpy });

    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  test("Should return 400 if no email is provided", async () => {
    const { sut, emailValidatorSpy } = makeSut();

    emailValidatorSpy.isEmailValid = false;

    const httpRequest = {
      body: {
        email: "invalid_email@email.com",
        password: "any_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(invalidParamError("email"));
  });

  test("Should return 500 if no emailValidator is provided", async () => {
    const { authUseCaseSpy } = makeSut();

    const sut = loginRouter({ authUseCase: authUseCaseSpy });

    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });

  test("Should return 500 if no emailValidator has no isValid method", async () => {
    const { authUseCaseSpy } = makeSut();

    const sut = loginRouter({
      authUseCase: authUseCaseSpy,
      emailValidator: {},
    });

    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(serverError());
  });

  test("Should return 500 if emailValidator throws", async () => {
    const { authUseCaseSpy } = makeSut();

    const emailValidatorSpy = makeEmailValidatorWithError();

    const sut = loginRouter({
      authUseCase: authUseCaseSpy,
      emailValidator: emailValidatorSpy,
    });

    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });
});
