const env = require('../env')

const development = {
  "username": env.DB_USER,
  "password": env.DB_PASSWORD,
  "database": env.DB_NAME,
  "host": env.DB_END_POINT,
  "dialect": "mysql",
  "timezone": "+09:00"
};

const test = {
  "username": "root",
  "password": "test1234",
  "database": "testTest2",
  "host": "127.0.0.1",
  "dialect": "mysql",
  "timezone": "+09:00"
};

const production = {
  "username": env.DB_USER,
  "password": env.DB_PASSWORD,
  "database": env.DB_NAME,
  "host": env.DB_END_POINT,
  "dialect": "mysql",
  "timezone": "+09:00"
};

module.exports = { development, production, test };
