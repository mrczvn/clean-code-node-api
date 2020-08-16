module.exports = {
  compare(value, hash) {
    const isValid = (valid = true) => valid;

    if (value !== 'any_password' || hash !== 'hashed_password')
      return isValid(false);

    this.value = value;
    this.hash = hash;

    return isValid();
  },
  value: '',
  hash: ''
};
