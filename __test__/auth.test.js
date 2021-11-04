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

// afterAll(async() => {
//   await sequelize.sync({ force : true });
// })