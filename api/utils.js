const crypto  = require("crypto").webcrypto;

module.exports = async function decrypt(alg, key, data) {
  let decrypted
  try {
    // Couldn't fix the Error: Cipher job failed
    decrypted = await crypto.subtle.decrypt(
      alg,
      key, 
      data, 
    )
  }
  catch (err) {
    throw new Error(err)
  }
  return decrypted
}