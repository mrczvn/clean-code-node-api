const bcrypt = require('bcrypt');

const encrypter = () => {
  return {
    compare: async ({ value, hash }) => {
      const isValid = await bcrypt.compare(value, hash);

      return isValid;
    },
  };
};

module.exports = encrypter;
