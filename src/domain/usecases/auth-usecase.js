const { missingParamError } = require('../../util');

const authUseCase = ({ loadUserByEmailRepository, encrypter }) => {
  return {
    auth: async ({ email, password }) => {
      if (!email) return missingParamError('email');

      if (!password) return missingParamError('password');

      const user = await loadUserByEmailRepository.load({ email, password });

      if (!user.accessToken) return { email: user.email, accessToken: null };

      const hashedPassword = await encrypter.compare({
        password,
        hashedPassword: user.hashedPassword,
      });

      return {
        email: user.email,
        password: user.password,
        accessToken: user.accessToken,
        hashedPassword,
      };
    },
  };
};

module.exports = authUseCase;
