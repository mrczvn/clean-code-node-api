const loadUserByEmailRepository = (userModel) => {
  return {
    load: async (email) => {
      const user = userModel.findOne(
        { email },
        { projection: { password: 1 } }
      );

      return user;
    },
  };
};

module.exports = loadUserByEmailRepository;
