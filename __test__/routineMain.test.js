const request = require('supertest');
const {sequelize} = require('../models');
const app = require('../app');
const baseData = require("./baseData");

function loginUser(auth) {
  return function(done) {
      request(app)
          .post('/api/auth/local')
          .send({
            userEmail: baseData.userEmail2,
            userPw: baseData.userPw2,
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

describe('루틴 CRUD', () => {
  let auth = {};
  beforeEach(loginUser(auth));

  test('루틴, 액션 생성 API', async () => {
    await request(app)
      .post('/api/routines/')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .send({
        routineName : "테스트 루틴 no1",
        actions : [{
          "actionName":"데드리프트",
          "actionType" : "맨몸운동",
          "actionCnt":"10"
        },{
          "actionName":"사이드레터럴레이즈",
          "actionType" : "스트레칭",
          "actionCnt":"20"
        }],
        isMain : false
      })
      .expect(200);
  })

  test('루틴조회 API', (done) => {
    request(app)
      .get('/api/routines/')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .expect(200, done)
  })

  test('Graph History 조회 API', (done) => {
    request(app)
      .get('/api/main/graphHistory')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .expect(200, done)
  })

  test('Habit Tracker 조회 API', (done) => {
    request(app)
      .get('/api/main/trackerHistory')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .expect(200, done)
  })

  test('루틴수정 API', (done) => {
    request(app)
      .put('/api/routines/4')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .send({
        routineName : "테스트 루틴 수정 no1",
        actions : [{
          "actionName":"데드리프트 수정",
          "actionType" : "스트레칭",
          "actionCnt":"11"
        }, {
          "actionName":"사이드레터럴레이즈 수정",
          "actionType" : "맨몸운동",
          "actionCnt":"21"
        }],
        isMain : false
      })
      .expect(200, done)
  })

  test('루틴삭제 API', (done) => {
    request(app)
      .delete('/api/routines/4')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .expect(200, done)
  })
})
