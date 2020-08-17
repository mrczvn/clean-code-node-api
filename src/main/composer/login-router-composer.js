const LoginRouter = require('../../presentation/routes/login-router');
const AuthUseCase = require('../../domain/usecases/auth-usecase');
const emailValidator = require('../../presentation/services/email-validator');
const loadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository');
const updateAccessTokenRepository = require('../../infra/repositories/update-access-token-repository');
const encrypter = require('../../presentation/services/encrypter');
const tokenGenerator = require('../../presentation/services/token-generator');
const { tokenSecret } = require('../config/env');

const loginRouterComposer = () => {
  return {
    compose() {
      tokenGenerator(tokenSecret);

      const authUseCase = AuthUseCase({
        loadUserByEmailRepository: loadUserByEmailRepository(),
        updateAccessTokenRepository: updateAccessTokenRepository(),
        encrypter: encrypter(),
        tokenGenerator: tokenGenerator(tokenGenerator),
      });

      const loginRouter = LoginRouter({
        authUseCase,
        emailValidator: emailValidator(),
      });

      return loginRouter;
    },
  };
};

module.exports = loginRouterComposer();
