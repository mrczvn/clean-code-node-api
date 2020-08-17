const mongoHelper = require('../helpers/mongo-helper');
const { missingParamError } = require('../../util');

const updateAccessTokenRepository = () => {
  return {
    async update({ userId, accessToken }) {
      if (!userId) throw missingParamError('userId');

      if (!accessToken) throw missingParamError('accessToken');

      const userModel = await mongoHelper.getCollection('users');

      await userModel.updateOne({ _id: userId }, { $set: { accessToken } });
    },
  };
};

module.exports = updateAccessTokenRepository;
