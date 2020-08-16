const { missingParamError } = require('../../util');

const updateAccessTokenRepository = (userModel) => {
  return {
    async update({ userId, accessToken }) {
      if (!userId) throw missingParamError('userId');

      if (!accessToken) throw missingParamError('accessToken');

      await userModel.updateOne({ _id: userId }, { $set: { accessToken } });
    },
  };
};

module.exports = updateAccessTokenRepository;
