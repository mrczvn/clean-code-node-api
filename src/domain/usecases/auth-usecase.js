const { missingParamError } = require('../../util');

const authUseCase = (loadUserByEmailRepository) => {
  return {
    auth: async ({ email, password }) => {
      if (!email) return missingParamError('email');

      if (!password) return missingParamError('password');

      const user = await loadUserByEmailRepository.load(email);

      if (!user.accessToken) return null;

      return {
        email: user.email,
        accessToken: user.accessToken,
      };
    },
  };
};

module.exports = authUseCase;
