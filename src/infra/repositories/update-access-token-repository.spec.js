const MongoHelper = require('../helpers/mongo-helper');
const { missingParamError } = require('../../util');

let db;

const updateAccessTokenRepository = (userModel) => {
  return {
    async update({ userId, accessToken }) {
      if (!userId) throw missingParamError('userId');

      if (!accessToken) throw missingParamError('accessToken');

      await userModel.updateOne({ _id: userId }, { $set: { accessToken } });
    },
  };
};

const makeSut = () => {
  const userModel = db.collection('users');
  const sut = updateAccessTokenRepository(userModel);

  return {
    sut,
    userModel,
  };
};

describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);

    db = await MongoHelper.getDb();
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should update the user with the given accessToken', async () => {
    const { sut, userModel } = makeSut();

    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 30,
      state: 'any_state',
      password: 'hashed_password',
    });

    const [{ _id }] = fakeUser.ops;

    await sut.update({ userId: _id, accessToken: 'valid_token' });

    const updateFakeUser = await userModel.findOne({ _id });

    expect(updateFakeUser.accessToken).toBe('valid_token');
  });

  test('Should throws if no userModel is provided', async () => {
    const { userModel } = makeSut();

    const sut = updateAccessTokenRepository();

    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 30,
      state: 'any_state',
      password: 'hashed_password',
    });

    const [{ _id }] = fakeUser.ops;

    const promise = sut.update({ serId: _id, accessToken: 'valid_token' });

    expect(promise).rejects.toThrow();
  });

  test('Should throws if no params are provided', async () => {
    const { sut, userModel } = makeSut();

    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 30,
      state: 'any_state',
      password: 'hashed_password',
    });

    const [{ _id }] = fakeUser.ops;

    expect(sut.update({})).rejects.toThrow(missingParamError('userId'));
    expect(sut.update({ userId: _id })).rejects.toThrow(
      missingParamError('accessToken')
    );
  });
});
