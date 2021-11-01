var createError = require('http-errors');

const myError = (status, message) => {
  return createError(status, message);
}

module.exports = myError;