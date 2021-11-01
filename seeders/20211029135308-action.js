'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    //  Add seed commands here.
    //  Example:
    const routines = await queryInterface.sequelize.query(
      `SELECT id from Routines;`
    );
    const routineRows = routines[0];

    await queryInterface.bulkInsert('actions', [
      {
        userId: null,
        routineId: routineRows[0].id,
        actionName: '앉았다 일어나기',
        actionType: 'stretching',
        actionCnt: 10,
        actionNum: 1,
        finDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: null,
        routineId: routineRows[0].id,
        actionName: '목 돌리기',
        actionType: 'stretching',
        actionCnt: 10,
        actionNum: 2,
        finDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: null,
        routineId: routineRows[0].id,
        actionName: '어깨 돌리기',
        actionType: 'stretching',
        actionCnt: 10,
        actionNum: 3,
        finDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: null,
        routineId: routineRows[0].id,
        actionName: '허리 돌리기',
        actionType: 'stretching',
        actionCnt: 10,
        actionNum: 4,
        finDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: null,
        routineId: routineRows[0].id,
        actionName: '무릎 돌리기',
        actionType: 'stretching',
        actionCnt: 10,
        actionNum: 5,
        finDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: null,
        routineId: routineRows[1].id,
        actionName: '스쿼트',
        actionType: 'body_exercise',
        actionCnt: 10,
        actionNum: 1,
        finDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: null,
        routineId: routineRows[1].id,
        actionName: '런지',
        actionType: 'body_exercise',
        actionCnt: 10,
        actionNum: 2,
        finDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: null,
        routineId: routineRows[1].id,
        actionName: '플랭크',
        actionType: 'body_exercise',
        actionCnt: 10,
        actionNum: 3,
        finDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: null,
        routineId: routineRows[1].id,
        actionName: '푸쉬업',
        actionType: 'body_exercise',
        actionCnt: 10,
        actionNum: 4,
        finDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('actions', null, {});
  }
};
