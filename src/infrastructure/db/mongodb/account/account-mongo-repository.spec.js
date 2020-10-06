const MongoHelper = require('../../helpers/mongo-helper')
const accountMongoRepository = require('./account-mongo-repository')

const mockAddAccountParams = () => ({
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

const makeSut = () => accountMongoRepository()

let accountCollection

describe('AccountMongoRepository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    const sut = makeSut()

    const addAccountParams = mockAddAccountParams()

    const account = await sut.add(addAccountParams)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.email).toBe(addAccountParams.email)
    expect(account.name).toBe(addAccountParams.name)
    expect(account.password).toBe(addAccountParams.password)
  })
})
