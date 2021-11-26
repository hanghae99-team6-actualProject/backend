'use strict';
const { encrypt } = require('../controllers/utils/bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    //  Add seed commands here.
    //  Example:
    await queryInterface.bulkInsert('users', [
      {
        providerId: 'localtest@testmail.com',
        userEmail: 'test@testmail.com',
        refreshToken: '',
        nickName: 'testtest',
        userPw: encrypt('test1234!'),
        provider: 'local',
        role: 'base_user',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        providerId: 'localtmp@testmail.com',
        userEmail: 'tmp@testmail.com',
        refreshToken: '',
        nickName: 'tmp',
        userPw: encrypt('test1234!'),
        provider: 'local',
        role: 'base_user',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        providerId: 'testUser3@testmail.com',
        userEmail: 'testUser3@testmail.com',
        refreshToken: '',
        nickName: 'user3',
        userPw: encrypt('test1234!'),
        provider: 'local',
        role: 'base_user',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    //  Add commands to revert seed here.
    //  Example:
    await queryInterface.bulkDelete('users', null, {});
  }
};
