const { missingParamError } = require('../../util');

const authUseCase = ({
  loadUserByEmailRepository,
  encrypter,
  tokenGenerator,
} = {}) => {
  return {
    auth: async ({ email, password }) => {
      if (!email) return missingParamError('email');

      if (!password) return missingParamError('password');

      const user = await loadUserByEmailRepository.load({ email, password });

      if (!user) return { accessToken: null };

      const hashedPassword = await encrypter.compare({
        password,
        hashedPassword: user.hashedPassword,
      });

      const { userId, accessToken } = await tokenGenerator.generate(user.id);

      return {
        userId,
        email: user.email,
        password: user.password,
        accessToken,
        hashedPassword,
      };
    },
  };
};

module.exports = authUseCase;
