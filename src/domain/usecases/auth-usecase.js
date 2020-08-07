const { missingParamError, invalidParamError } = require('../../util');

const authUseCase = (loadUserByEmailRepository) => {
  return {
    auth: async ({ email, password }) => {
      if (!email) return missingParamError('email');

      if (!password) return missingParamError('password');

      if (!loadUserByEmailRepository)
        return missingParamError('loadUserByEmailRepository');

      if (!loadUserByEmailRepository.load)
        return invalidParamError('loadUserByEmailRepository');

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
