const request = require('supertest');
const {sequelize} = require('../models');
const app = require('../app');
const baseData = require("./baseData")



//-----

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

describe('내 액션 관련', () => {
  let auth = {};
  beforeEach(loginUser(auth));

  test('액션만 완료 API', (done) => {
    request(app)
      .put('/api/actions')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .send({
        "actionId" : 1,
        "routineId" : 1
      })
      .expect(200, done);
  })
})