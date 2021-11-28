// 사용자 인증 미들웨어
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const env = require('../env')


//현재 게스트 로그인을 지원하지 않기 때문에 비로그인 상태에서는 next()로 보내지 않고 모두 에러처리합니다.
//만약 게스트 로그인이 지원된다면 next와 res.status 주석상태를 변경하면 됩니다.
const authMiddleware = async (req, res, next) => {
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
      // next();
      res.status(401).json({ result: false, msg: "미들웨어 !accessToken" });
      return;
    }
    const accessTokenType = accessToken.split(' ')[0];
    const accessTokenValue = accessToken.split(' ')[1];
    const refreshTokenType = refreshToken.split(' ')[0];
    const refreshTokenValue = refreshToken.split(' ')[1];

    if (accessTokenType !== "Bearer" || refreshTokenType !== "Bearer") {
      console.log('미들웨어 TokenType !== "Bearer"')
      // next();
      res.status(401).json({ result: false, msg: '미들웨어 accessTokenType !== "Bearer"' });
      return;
    }

    if (accessTokenValue === null || !accessTokenValue || accessTokenValue === 'undefined'
      || refreshTokenValue === null || !refreshTokenValue || refreshTokenValue === 'undefined') {
      console.log('미들웨어 TokenValue === null || !TokenValue || TokenValue === "undefined"')
      // next();
      res.status(401).json({ result: false, msg: '미들웨어 TokenValue === null || !TokenValue || TokenValue === "undefined"' });
      return;
    }

    let accessVerified = null;
    let refreshVerified = null;

    try {
      accessVerified = jwt.verify(accessTokenValue, env.JWT_SECRET_KEY)
    } catch (err) {
      accessVerified = null;
    }
    try {
      refreshVerified = jwt.verify(refreshTokenValue, env.JWT_SECRET_KEY)
    } catch (err) {
      refreshVerified = null;
    }

    try {
      if (!accessVerified && !refreshVerified) {
        return res.status(401).send({ result: false, msg: "로그인되지 않았습니다" });
      }
      if (!accessVerified && refreshVerified) {
        const thisUser = await User.findOne({ where: { refreshToken: refreshTokenValue } })
        if (!thisUser) throw new Error('refreshVerified에러, db에 유저가 없습니다.');
        //accessToken 발급
        const providerId = thisUser?.providerId;

        const newAccessToken = jwt.sign({ providerId }, env.JWT_SECRET_KEY, {
          expiresIn: "1h",
          issuer: 'mingijuk'
        });

        return res.send({
          result: 'true1',
          accessToken: newAccessToken,
          user: thisUser,
          msg: 'accessToken 재발급'
        });
      }
      if (accessVerified && !refreshVerified) {
        const providerId = accessVerified.providerId;

        //refreshToken 발급
        const newRefreshToken = jwt.sign({ providerId }, env.JWT_SECRET_KEY, {
          expiresIn: "14d",
          issuer: 'mingijuk'
        });

        //refreshToken은 발급 후 db에도 넣어주어야 한다.
        await User.update({ refreshToken: newRefreshToken }, { where: { providerId } })

        const thisUser = await User.findOne({ where: { providerId } })
        if (!thisUser) throw new Error('accessVerified에러, db에 유저가 없습니다.')

        return res.send({
          result: 'true2',
          refreshToken: newRefreshToken,
          user: thisUser,
          msg: 'refreshToken 재발급'
        });
      }
      if (accessVerified && refreshVerified) {
        const providerId = accessVerified.providerId;

        const thisUser = await User.findOne({ where: { providerId } })
        if (!thisUser) throw new Error('accessVerified에러, db에 유저가 없습니다.')
        res.locals.user = thisUser;
        console.log('미들웨어 통과')
        next();
        return;
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ result: false, msg: err.message });
    }
  }
  catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;