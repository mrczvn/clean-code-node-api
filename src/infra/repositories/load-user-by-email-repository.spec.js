const loadUserByEmailRepository = () => {
  return {
    load: async () => {
      return null;
    },
  };
};

const makeSut = () => loadUserByEmailRepository();

describe('LoadUserByEmailRepository', () => {
  test('Should return null if no user is found', async () => {
    const sut = makeSut();

    const user = await sut.load('invalid_email@mail.com');

    expect(user).toBeNull();
  });
});
