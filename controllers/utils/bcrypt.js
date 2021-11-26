const bcrypt = require('bcrypt');
const env = require('../../env')

const encrypt = (planeText) => {
  return bcrypt.hashSync(planeText, Number(env.SALT));
}

const compare = async (planeText, textHash) => {
  return await bcrypt.compare(planeText, textHash)
}

module.exports = { encrypt, compare };