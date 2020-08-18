module.exports = {
  mongoUrl: process.env.MONGO_URL || process.env.MONGO_URL_DEV,
  tokenSecret: process.env.TOKEN_SECRET || 'secret',
  port: process.env.PORT || 8000,
  novo: 'ydhc',
};
