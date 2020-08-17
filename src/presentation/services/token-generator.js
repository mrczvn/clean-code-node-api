const jwt = require('jsonwebtoken');
const { missingParamError } = require('../../util');

const tokenGenerator = (secret) => {
  return {
    generate: async (id) => {
      if (!secret) throw missingParamError('secret');

      if (!id) throw missingParamError('id');

      return jwt.sign({ _id: id }, secret);
    },
  };
};

module.exports = tokenGenerator;
