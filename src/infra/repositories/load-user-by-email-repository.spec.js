const MongoHelper = require('../helpers/mongo');
const loadUserByEmailRepository = require('./load-user-by-email-repository');
const { missingParamError } = require('../../util');

let db;

const makeSut = () => {
  const userModel = db.collection('users');

  const sut = loadUserByEmailRepository(userModel);

  return {
    userModel,
    sut
  };
};

describe('LoadUserByEmail Repository', () => {
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
      password: 'hashed_password'
    });

    const [{ _id, password }] = fakeUser.ops;

    const user = await sut.load('valid_email@mail.com');

    expect(user).toEqual({ _id, password });
  });

  test('Should throws if no userModel is provided', () => {
    const sut = loadUserByEmailRepository();

    const promise = sut.load('any_email@mail.com');

    expect(promise).rejects.toThrow();
  });

  test('Should throws if no email is provided', () => {
    const { sut } = makeSut();

    const promise = sut.load();

    expect(promise).rejects.toThrow(missingParamError('email'));
  });
});
