'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    //  Add seed commands here.
    //  Example:
    await queryInterface.bulkInsert('routines', [
      {
        userId: null,
        routineName: '움직이기 싫은 오늘, 기본만 하자!',
        isMain: 0,
        preSet: 1,
        finDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: null,
        routineName: '오늘은 좀 운동이 필요한 날이야!',
        isMain: 0,
        preSet: 1,
        finDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('routines', null, {});
  }
};
