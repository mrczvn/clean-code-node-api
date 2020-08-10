const bcrypt = require('bcrypt');
const { missingParamError } = require('../../util');

const encrypter = () => {
  return {
    compare: async ({ value, hash }) => {
      if (!value) throw missingParamError('value');

      if (!hash) throw missingParamError('hash');

      const isValid = await bcrypt.compare(value, hash);

      return isValid;
    },
  };
};

module.exports = encrypter;
