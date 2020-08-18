const jwt = require('jsonwebtoken');
const { missingParamError } = require('../../util');

const tokenGenerator = (secret) => {
  return {
    generate: (id) => {
      if (!secret) return missingParamError('secret');

      if (!id) return missingParamError('id');

      return jwt.sign({ _id: id }, secret);
    },
  };
};

module.exports = tokenGenerator;
