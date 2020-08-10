const { missingParamError } = require('../../util');

const authUseCase = ({
  loadUserByEmailRepository,
  updateAccessTokenRepository,
  encrypter,
  tokenGenerator,
} = {}) => {
  return {
    auth: async ({ email, password }) => {
      if (!email) return missingParamError('email');

      if (!password) return missingParamError('password');

      const user = await loadUserByEmailRepository.load({ email, password });

      const isValid =
        user &&
        (await encrypter.compare({ password, hashedPassword: user.password }));

      if (isValid) {
        const accessToken = await tokenGenerator.generate(user.id);

        await updateAccessTokenRepository.update({
          userId: user.id,
          accessToken,
        });

        return accessToken;
      }
      return { accessToken: null };
    },
  };
};

module.exports = authUseCase;
