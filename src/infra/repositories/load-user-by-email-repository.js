const { missingParamError } = require('../../util');
const mongoHelper = require('../helpers/mongo-helper');

const loadUserByEmailRepository = () => {
  return {
    load: async (email) => {
      if (!email) throw missingParamError('email');

      const db = await mongoHelper.getDb();

      const user = await db
        .collection('users')
        .findOne({ email }, { projection: { password: 1 } });

      return user;
    },
  };
};

module.exports = loadUserByEmailRepository;
