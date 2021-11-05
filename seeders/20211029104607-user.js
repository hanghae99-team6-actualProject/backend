'use strict';
const { encryptPw } = require('../controllers/utils/bcrypt')

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
        userPw: encryptPw('test1234!'),
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
        userPw: encryptPw('test1234!'),
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
