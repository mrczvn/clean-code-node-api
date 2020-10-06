const bcrypt = require('bcrypt')

const bcryptAdapter = (salt) => ({
  hash: async (plaintext) => await bcrypt.hash(plaintext, salt)
})

module.exports = bcryptAdapter
