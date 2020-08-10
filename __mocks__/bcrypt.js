const bcrypt = {
  compare: (value, hash) => {
    const isValid = (valid = true) => valid;

    if (value !== 'any_password' || hash !== 'hashed_password')
      return isValid(false);

    return isValid();
  },
};

module.exports = bcrypt;
