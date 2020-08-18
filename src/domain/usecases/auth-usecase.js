const { missingParamError } = require('../../util');

const authUseCase = ({
  loadUserByEmailRepository,
  updateAccessTokenRepository,
  encrypter,
  tokenGenerator,
} = {}) => {
  return {
    auth: async ({ email, password }) => {
      if (!email) throw missingParamError('email');

      if (!password) throw missingParamError('password');

      const user = await loadUserByEmailRepository.load(email);

      const isValid =
        user &&
        (await encrypter.compare({ value: password, hash: user.password }));

      if (isValid) {
        const accessToken = await tokenGenerator.generate(user._id);

        await updateAccessTokenRepository.update({
          userId: user._id,
          accessToken,
        });

        return accessToken;
      }
      return null;
    },
  };
};

module.exports = authUseCase;
