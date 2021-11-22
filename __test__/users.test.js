const request = require('supertest');
const app = require('../app');
const baseData = require("./baseData");

function loginUser(auth) {
  return function (done) {
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

describe('내 모임 관련', () => {
  let auth = {};
  beforeEach(loginUser(auth));

  test('내가 만든 모임 조회 API', async () => {
    await request(app)
      .post('/api/users/moims')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .send({
        "userType": 1
      })
      .expect(200);
  }),

  test('내가 참여한 모임 조회 API', async () => {
    await request(app)
      .post('/api/users/moims')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .send({
        "userType": 0
      })
      .expect(200);
  }),

  test('내 모임 댓글 API', async () => {
    await request(app)
      .get('/api/users/comments')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .expect(200);
  })
})