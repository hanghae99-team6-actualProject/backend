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
      .post('/api/character')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .expect(200, done);
  })
})

describe('내 액션 관련', () => {
  let auth = {};
  beforeEach(loginUser(auth));

  test('액션만 완료 API', (done) => {
    request(app)
      .put('/api/users/action')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .send({
        "actionId" : 1,
        "routineId" : 1
      })
      .expect(200, done);
  })
})

describe('내 모임 관련', () => {
  let auth = {};
  beforeEach(loginUser(auth));

  test('내가 만든 모임 조회 API', (done) => {
    request(app)
      .post('/api/users/moims')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .send({
        "userType": 1
      })
      .expect(200, done);
  }),

  test('내가 참여한 모임 조회 API', (done) => {
    request(app)
      .post('/api/users/moims')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .send({
        "userType": 0
      })
      .expect(200, done);
  }),

  test('내 모임 댓글 API', (done) => {
    request(app)
      .get('/api/users/comments')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .expect(200, done);
  })
})