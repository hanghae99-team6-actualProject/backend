const request = require('supertest');
const {sequelize} = require('../models');
const app = require('../app');

beforeAll(async () => {
  await sequelize.sync();
});

describe('POST /signup', () => {
  test('회원가입', (done,res) => {
    request(app)
      .post('/api/auth/signup')
      .send({
        "userEmail" : "user1@naver.com",
        "userPw" : "Password!001",
        "userPwChk" : "Password!001",
        "nickName" : "testNick1"
      })
      .expect(201, done);
  })
})

function loginUser(auth) {
  return function(done) {
      request(app)
          .post('/api/auth/local')
          .send({
            userEmail: 'user1@naver.com',
            userPw: 'Password!001',
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

  test('내정보', (done) => {
    request(app)
      .get('/api/auth/me')
      .set('accessToken', 'Bearer ' + auth.accessToken)
      .set('refreshToken', 'Bearer ' + auth.refreshToken)
      .expect(200, done);
  })
})

// describe('GET /me', () => {
//   const agent = request.agent(app);
//   beforeEach((done) => {
//     agent
//       .post('/api/auth/local')
//       .send({
//         userEmail: 'localuser2@naver.com',
//         userPw: 'Password!002',
//       })
//       .end(done);
//   });

//   test('내정보', (done) => {
//     agent
//       .get('/api/auth/me')
//       .set('accessToken', 'abc123')
//       .set('refreshToken', 'abc123')
//       .send({
//         "userEmail" : "user3@naver.com",
//         "userPw" : "Password!001",
//       })
//       .expect(401, done);
//   })
// })

afterAll(async() => {
  await sequelize.sync({ force : true });
})