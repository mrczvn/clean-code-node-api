const validator = require('validator');
const { missingParamError } = require('../../util');

const emailValidator = () => {
  return {
    isValid: (email) => {
      if (!email) throw missingParamError('email');

      return validator.isEmail(email);
    },
  };
};

module.exports = emailValidator;
