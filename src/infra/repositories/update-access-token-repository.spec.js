const MongoHelper = require('../helpers/mongo-helper');
const updateAccessTokenRepository = require('./update-access-token-repository');
const { missingParamError } = require('../../util');

let userModel;

const makeSut = () => updateAccessTokenRepository();

describe('UpdateAccessToken Repository', () => {
  let _id;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);

    userModel = await MongoHelper.getCollection('users');
  });

  beforeEach(async () => {
    await userModel.deleteMany();

    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 30,
      state: 'any_state',
      password: 'hashed_password',
    });

    [{ _id }] = fakeUser.ops;
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should update the user with the given accessToken', async () => {
    const sut = makeSut();

    await sut.update({ userId: _id, accessToken: 'valid_token' });

    const updateFakeUser = await userModel.findOne({ _id });

    expect(updateFakeUser.accessToken).toBe('valid_token');
  });

  test('Should throws if no params are provided', async () => {
    const sut = makeSut();

    expect(sut.update({})).rejects.toThrow(missingParamError('userId'));
    expect(sut.update({ userId: _id })).rejects.toThrow(
      missingParamError('accessToken')
    );
  });
});
