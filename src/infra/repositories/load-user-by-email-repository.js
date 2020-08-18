const { missingParamError } = require('../../util');
const mongoHelper = require('../helpers/mongo-helper');

const loadUserByEmailRepository = () => {
  return {
    load: async (email) => {
      if (!email) throw missingParamError('email');

      const userModel = await mongoHelper.getCollection('users');

      const user = await userModel.findOne(
        { email },
        { projection: { password: 1 } }
      );

      return user;
    },
  };
};

module.exports = loadUserByEmailRepository;
