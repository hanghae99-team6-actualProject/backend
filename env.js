require('dotenv').config();

const nodeenv = process.env.NODE_ENV === 'development';
env = {
  NODE_ENV: process.env.NODE_ENV,

  EXPRESS_PORT: process.env.EXPRESS_PORT,

  DB_USER: nodeenv ? process.env.DEV_DB_USER : process.env.PRODUCT_DB_USER,
  DB_PASSWORD: nodeenv ? process.env.DEV_DB_PASSWORD : process.env.PRODUCT_DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_END_POINT: nodeenv ? process.env.DEV_DB_END_POINT : process.env.PRODUCT_DB_END_POINT,

  DOMAIN: nodeenv ? process.env.LOCALHOST_END_POINT : process.env.PRODUCT_END_POINT,

  AWS_S3_KEY: process.env.AWS_S3_KEY,
  AWS_S3_PRIVATE_KEY: process.env.AWS_S3_PRIVATE_KEY,

  KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,

  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
}
module.exports = env;