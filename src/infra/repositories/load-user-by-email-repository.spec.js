const { MongoClient } = require('mongodb');

let client;
let db;

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

    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 30,
      state: 'any_state',
      password: 'hashed_password',
    });

    const [{ _id, password }] = fakeUser.ops;

    const user = await sut.load('valid_email@mail.com');

    expect(user).toEqual({ _id, password });
  });
});
