const MongoHelper = require('../../helpers/mongo-helper')

const accountMongoRepository = () => ({
  async add(data) {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.insertOne(data)

    return MongoHelper.map(account.ops[0])
  }
})

module.exports = accountMongoRepository
