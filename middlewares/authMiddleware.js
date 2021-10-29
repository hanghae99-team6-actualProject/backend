// 사용자 인증 미들웨어
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const env = require('../env')

module.exports = async (req, res, next) => {
  try {
    console.log('req.headers', req.headers);
    if (!req.headers) {
      res.locals.user = null;
      console.log('미들웨어 !req.headers')
      next();
      return;
    }

    const { refreshtoken: refreshToken, accesstoken: accessToken } = req.headers;
    console.log('req.headers.refreshtoken', refreshToken);
    console.log('req.headers.accesstoken', accessToken);
    if (!accessToken) {
      res.locals.user = null;
      console.log('미들웨어 !accessToken')
      next();
      return;
    }
    const tokenType = accessToken.split(' ')[0];
    const tokenValue = accessToken.split(' ')[1];

    if (tokenType !== "Bearer") {
      console.log('미들웨어 tokenType !== "Bearer"')
      next();
      return;
    }

    if (tokenValue === null || !tokenValue || tokenValue === 'undefined') {
      console.log('미들웨어 tokenValue === null || !tokenValue || tokenValue === "undefined"')
      next();
      return;
    }

    const { providerId } = jwt.verify(tokenValue, env.JWT_SECRET_KEY);
    const user = await User.findOne({ where: { providerId } })

    res.locals.user = user;
    console.log('미들웨어 통과')
    next();
    return;
  }
  catch (error) {
    return res.status(400).send({ msg: "알수없는 오류가 발생했습니다." });
  }
};