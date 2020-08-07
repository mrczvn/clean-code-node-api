const { missingParamError } = require('../../util');

const authUseCase = (loadUserByEmailRepository) => {
  return {
    auth: async ({ email, password }) => {
      if (!email) return missingParamError('email');

      if (!password) return missingParamError('password');

      const user = await loadUserByEmailRepository.load({ email, password });

      if (!user.accessToken) return { email: user.email, accessToken: null };

      return {
        email: user.email,
        accessToken: user.accessToken,
      };
    },
  };
};

module.exports = authUseCase;
