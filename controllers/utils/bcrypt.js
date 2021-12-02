const bcrypt = require('bcrypt');
const env = require('../../env');

const encrypt = (planeText) => bcrypt.hashSync(planeText, Number(env.SALT));

const compare = async (planeText, hashText) => await bcrypt.compare(planeText, hashText);

module.exports = { encrypt, compare };
