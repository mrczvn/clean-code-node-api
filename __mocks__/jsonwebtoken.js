module.exports = {
  sign(id, secret) {
    if (id !== 'any_id') return null;

    this.id = id;
    this.secret = secret;

    return this.token;
  },
  token: 'any_token',
  id: '',
  secret: '',
};
