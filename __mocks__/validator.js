module.exports = {
  isEmail: (email) => {
    const isValidated = (value) => {
      return { value, email };
    };

    if (email !== 'any_email@mail.com') return isValidated(false);

    return isValidated(true);
  }
};
