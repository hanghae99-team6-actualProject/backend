const request = require('supertest');
const {sequelize} = require('../models');
const app = require('../app');
const baseData = require("./baseData")

// router.get('/', getAllMoim); //미들웨어 제거
// router.post('/', authMiddleware, createMoim);
// router.get('/:moimId', authMiddleware, detailMoim);
// router.put('/:moimId', authMiddleware, updateMoim);
// router.delete('/:moimId', authMiddleware, deleteMoim);
// router.post('/:moimId', authMiddleware, enterMoim);
// router.post('/:moimId/exit', authMiddleware, exitMoim);

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

function loginUser2(auth) {
  return function(done) {
      request(app)
          .post('/api/auth/local')
          .send({
            "userEmail" : baseData.userEmail2,
            "userPw" : baseData.userPw2,
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

describe('모임 CRUD', () => {
  let auth = {};
  beforeEach(loginUser(auth));

  test('1번 모임 생성 API', (done) => {
    request(app)
      .post('/api/moims')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .send({
        title: baseData.moimTitle1,
        contents: baseData.moimContents1,
        imgSrc: baseData.moimImg1,
      })
      .expect(200, done);
  })

  test('2번 모임 생성 API', (done) => {
    request(app)
      .post('/api/moims')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .send({
        title: baseData.moimTitle2,
        contents: baseData.moimContents2,
        imgSrc: baseData.moimImg2,
      })
      .expect(200, done);
  })

  test('모임 전체 조회 API', (done) => {
    request(app)
      .get('/api/moims')
      .expect(200, done);
  })

  test('모임 상세 조회 API', (done) => {
    request(app)
      .get('/api/moims/1')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .expect(200, done);
  })

  test('모임 수정 API', (done) => {
    request(app)
      .put('/api/moims/1')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .send({
        title: '1번 타이틀 수정',
        contents: '1번 컨텐츠 수정',
        imgSrc: '1번 이미지 수정',
      })
      .expect(200, done);
  })

  test('모임 삭제 API', (done) => {
    request(app)
      .delete('/api/moims/1')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .expect(200, done);
  })
})

describe('모임 참여/탈퇴', () => {
  let auth = {};
  beforeEach(loginUser2(auth));

  test('모임 참여 API', (done) => {
    request(app)
      .post('/api/moims/2')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .expect(200, done);
  })

  test('모임 탈퇴 API', (done) => {
    request(app)
      .post('/api/moims/2/exit')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .expect(200, done);
  })
})