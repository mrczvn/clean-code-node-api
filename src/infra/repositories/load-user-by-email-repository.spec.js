const { MongoClient } = require('mongodb');

let client;
let db;

const loadUserByEmailRepository = (userModel) => {
  return {
    load: async (email) => {
      const user = userModel.findOne({ email });

      return user;
    },
  };
};

const makeSut = () => {
  const userModel = db.collection('users');
  const sut = loadUserByEmailRepository(userModel);

  return {
    userModel,
    sut,
  };
};

describe('LoadUserByEmail Repository', () => {
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
    const { sut } = makeSut();

    const user = await sut.load('invalid_email@mail.com');

    expect(user).toBeNull();
  });

  test('Should returns null if no user is found', async () => {
    const { sut, userModel } = makeSut();

    await userModel.insertOne({ email: 'valid_email@mail.com' });

    const user = await sut.load('valid_email@mail.com');

    expect(user.email).toBe('valid_email@mail.com');
  });
});
