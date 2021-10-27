// 사용자 인증 미들웨어
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
    console.log(req.headers);
    if (!req.headers) {
      res.locals.user = null;
      console.log('!req.headers')
      next();
      return;
    }

    const { refreshtoken: refreshToken, accesstoken: accessToken } = req.headers

    if (!accessToken) {
      res.locals.user = null;
      console.log('!accessToken')
      next();
      return;
    }
    const tokenType = accessToken.split(' ')[0];
    const tokenValue = accessToken.split(' ')[1];

    if (tokenType !== "Bearer") {
      console.log('tokenType !== "Bearer"')
      next();
      return;
    }

    if (tokenValue === null || !tokenValue || tokenValue === 'undefined') {
      console.log('tokenValue === null || !tokenValue || tokenValue === "undefined"')
      next();
      return;
    }

    const { providerId } = jwt.verify(tokenValue, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ where: { providerId } })

    res.locals.user = user;
    next();
    return;
  }
  catch (error) {
    return res.status(400).send({ msg: "알수없는 오류가 발생했습니다." });
  }
};