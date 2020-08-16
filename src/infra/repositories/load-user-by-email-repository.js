const { missingParamError } = require('../../util');

const loadUserByEmailRepository = (userModel) => {
  return {
    load: async (email) => {
      if (!email) throw missingParamError('email');

      const user = await userModel.findOne(
        { email },
        { projection: { password: 1 } }
      );

      return user;
    }
  };
};

module.exports = loadUserByEmailRepository;
