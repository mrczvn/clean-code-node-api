const jwt = require('jsonwebtoken')

const jwtAdapter = (secret) => ({
  encrypt: (plaintext) => jwt.sign({ id: plaintext }, secret),

  decrypt: (ciphertext) => jwt.verify(ciphertext, secret)
})

module.exports = jwtAdapter
