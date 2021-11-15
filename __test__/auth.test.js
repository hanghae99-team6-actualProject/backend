const request = require('supertest');
const {sequelize} = require('../models');
const app = require('../app');
const baseData = require("./baseData")

describe('POST /signup', () => {
  test('회원가입 API', (done,res) => {
    request(app)
      .post('/api/auth/signup')
      .send({
        "userEmail" : baseData.newUserEmail,
        "userPw" : baseData.newUserPw,
        "userPwChk" : baseData.newUserPwChk,
        "nickName" : baseData.newNickName
      })
      .expect(201, done);
  })
})

function loginUser(auth) {
  return function(done) {
      request(app)
          .post('/api/auth/local')
          .send({
            "userEmail" : baseData.newUserEmail,
            "userPw" : baseData.newUserPw,
          })
          .expect(200)
          .end(onResponse);

      function onResponse(err, res) {
          auth.accessToken = res.body.accessToken;
          auth.refreshToken = res.body.refreshToken;
          return done();
      }
  };
}

describe('GET /me', () => {
  let auth = {};
  beforeEach(loginUser(auth));

  test('내정보 API', (done) => {
    request(app)
      .get('/api/auth/me')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .expect(200, done);
  })
})

describe('GET /logout', () => {
  let auth = {};
  beforeEach(loginUser(auth));

  test('로그아웃 API', (done) => {
    request(app)
      .get('/api/auth/logout')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .expect(200, done);
  })
})