require('dotenv').config();

const nodeenv = process.env.NODE_ENV === 'development';
env = {
  NODE_ENV: process.env.NODE_ENV,

  DB_USER: nodeenv ? process.env.DEV_DB_USER : process.env.PRODUCT_DB_USER,
  DB_PASSWORD: nodeenv ? process.env.DEV_DB_PASSWORD : process.env.PRODUCT_DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_END_POINT: process.env.DB_END_POINT,
  EXPRESS_PORT: process.env.EXPRESS_PORT,

  DOMAIN: nodeenv ? process.env.DEV_DB_USER : process.env.PRODUCT_DOMAIN,

  KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,

  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
}
module.exports = env;