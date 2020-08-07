const { missingParamError } = require('../../util');

const authUseCase = () => {
  return {
    auth: async (email) => {
      if (!email) return missingParamError('email');
    },
  };
};

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const sut = authUseCase();

    const promise = sut.auth();

    expect(promise).rejects.toThrow(missingParamError('email'));
  });
});
