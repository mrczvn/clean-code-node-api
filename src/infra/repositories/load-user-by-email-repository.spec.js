const { MongoClient } = require('mongodb');

const loadUserByEmailRepository = (userModel) => {
  return {
    load: async (email) => {
      const user = userModel.findOne({ email });

      return user;
    },
  };
};

describe('LoadUserByEmail Repository', () => {
  let client;
  let db;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    db = await client.db();
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany();
  });

  afterAll(async () => {
    await client.close();
  });

  test('Should returns null if no user is found', async () => {
    const userModel = db.collection('users');

    const sut = loadUserByEmailRepository(userModel);

    const user = await sut.load('invalid_email@mail.com');

    expect(user).toBeNull();
  });

  test('Should returns null if no user is found', async () => {
    const userModel = db.collection('users');

    await userModel.insertOne({ email: 'valid_email@mail.com' });

    const sut = loadUserByEmailRepository(userModel);

    const user = await sut.load('valid_email@mail.com');

    expect(user.email).toBe('valid_email@mail.com');
  });
});
