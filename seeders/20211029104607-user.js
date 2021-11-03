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
        avatarUrl: 'https://ww.namu.la/s/8d4d0ca950b1207a3e90d2fe9de4a1de19b91c1677ccf7beca40bcfdc11642892c1d984a7b686cb827beeff1fa56a980cb3c1a03e35614dc037bfcbdb892ce8d5f4db78243e1a783c65ef29631e98718a97e3534dea619a24b0b7a1f96a86d47',
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
        avatarUrl: 'https://ww.namu.la/s/8d4d0ca950b1207a3e90d2fe9de4a1de19b91c1677ccf7beca40bcfdc11642892c1d984a7b686cb827beeff1fa56a980cb3c1a03e35614dc037bfcbdb892ce8d5f4db78243e1a783c65ef29631e98718a97e3534dea619a24b0b7a1f96a86d47',
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
