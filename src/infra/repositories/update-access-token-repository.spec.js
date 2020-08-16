const MongoHelper = require('../helpers/mongo-helper');

let db;

const updateAccessTokenRepository = (userModel) => {
  return {
    async update({ userId, accessToken }) {
      await userModel.updateOne({ _id: userId }, { $set: { accessToken } });
    },
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
    const userModel = db.collection('users');

    const sut = updateAccessTokenRepository(userModel);

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
});
