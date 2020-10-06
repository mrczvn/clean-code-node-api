const bcrypt = require('bcrypt')

const bcryptAdapter = (salt) => ({
  hash: async (plaintext) => await bcrypt.hash(plaintext, salt),

  compare: async ({ plaintext, digest }) =>
    await bcrypt.compare(plaintext, digest)
})

module.exports = bcryptAdapter
