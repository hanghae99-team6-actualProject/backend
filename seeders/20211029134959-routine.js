'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    //  Add seed commands here.
    //  Example:
    await queryInterface.bulkInsert('routines', [
      {
        userId: 1,
        routineName: '움직이기 싫은 오늘, 기본만 하자!',
        isMain: 1,
        preSet: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        routineName: '오늘은 좀 운동이 필요한 날이야!',
        isMain: 0,
        preSet: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        routineName: '직접 만든 루틴으로 활기찬 하루!',
        isMain: 0,
        preSet: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('routines', null, {});
  }
};
