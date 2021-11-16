var createError = require('http-errors');
const logger = require('../logger');

const wrapAsync = (func) => {
  // 모든 오류를 .catch() 처리하고 체인의 next() 미들웨어에 전달하세요
  // (이 경우에는 오류 처리기)
  return function (req, res, next) {
    func(req, res, next).catch(next);
  }
}

const asyncErrorHandeler = wrapAsync(async function (req, res, next) {
  await new Promise((resolve) => setTimeout(() => resolve(), 50));
  throw new Error("비동기 에러 발생!");
})

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).send({ result: false, msg: `code ${err.status || 500}: ${err.message}` });
}

const error404 = (req, res, next) => {
  next(createError(404));
}

module.exports = { errorHandler, error404, asyncErrorHandeler };