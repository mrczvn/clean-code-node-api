const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../config/app');
const mongoHelper = require('../../infra/helpers/mongo-helper');

let userModel;

describe('Login Router', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);

    userModel = await mongoHelper.getCollection('users');
  });

  beforeEach(async () => {
    await userModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should return 200 when valid credentials are provided', async () => {
    await userModel.insertOne({
      email: 'valid_email@mail.com',
      password: bcrypt.hashSync('hashed_password', 10),
    });

    await request(app)
      .post('/api/login')
      .send({
        email: 'valid_email@mail.com',
        password: 'hashed_password',
      })
      .expect(200);
  });

  test('Should return 401 when invalid credentials are provided', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'valid_email@mail.com',
        password: 'hashed_password',
      })
      .expect(401);
  });
});
