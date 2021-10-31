const bcrypt = require('bcrypt');
const env = require('../../env')

const encryptPw = (userPw) => {
  return bcrypt.hashSync(userPw, Number(env.SALT));
}

const pwCompare = async (pw, pwHash) => {
  return await bcrypt.compare(pw, pwHash)
}

module.exports = { encryptPw, pwCompare };