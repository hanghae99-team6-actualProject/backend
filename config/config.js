const env = require('../env')

const development = {
  "username": env.DB_USER,
  "password": env.DB_PASSWORD,
  "database": env.DB_NAME,
  "host": env.DB_END_POINT,
  "dialect": "mysql"
};

const test = {
  "username": env.DB_USER,
  "password": env.DB_PASSWORD,
  "database": env.DB_NAME,
  "host": env.DB_END_POINT,
  "dialect": "mysql"
};

const production = {
  "username": env.DB_USER,
  "password": env.DB_PASSWORD,
  "database": env.DB_NAME,
  "host": env.DB_END_POINT,
  "dialect": "mysql"
};

module.exports = { development, production, test };
