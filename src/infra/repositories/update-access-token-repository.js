const mongoHelper = require('../helpers/mongo-helper');
const { missingParamError } = require('../../util');

const updateAccessTokenRepository = () => {
  return {
    async update({ userId, accessToken }) {
      if (!userId) throw missingParamError('userId');

      if (!accessToken) throw missingParamError('accessToken');

      const db = await mongoHelper.getDb();

      await db
        .collection('users')
        .updateOne({ _id: userId }, { $set: { accessToken } });
    },
  };
};

module.exports = updateAccessTokenRepository;
