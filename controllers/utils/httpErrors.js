const createError = require('http-errors');

const myError = (status, message) => createError(status, message);

module.exports = myError;
