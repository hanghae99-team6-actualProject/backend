const request = require('supertest');
const {sequelize} = require('../models');
const app = require('../app');
const baseData = require("./baseData")

function loginUser(auth) {
  return function(done) {
      request(app)
          .post('/api/auth/local')
          .send({
            "userEmail" : baseData.userEmail,
            "userPw" : baseData.userPw,
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

describe('캐릭터 생성', () => {
  let auth = {};
  beforeEach(loginUser(auth));

  test('캐릭터 생성 API', (done) => {
    request(app)
      .post('/api/characters')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .expect(200, done);
  })

})


