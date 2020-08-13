module.exports = {
  token: 'any_token',
  sign(id) {
    if (id !== 'any_id') return null;
    return this.token;
  },
};
