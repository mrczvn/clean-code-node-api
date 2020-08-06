const validator = require('validator');

const emailValidator = () => {
  return {
    isValid: (email) => validator.isEmail(email),
  };
};

module.exports = emailValidator;
