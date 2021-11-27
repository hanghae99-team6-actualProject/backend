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
        userId: 1,
        routineId: routineRows[0].id,
        actionName: '앉았다 일어나기',
        actionType: 'stretching',
        actionCnt: 10,
        actionNum: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDel: 0,
      },
      {
        userId: 1,
        routineId: routineRows[0].id,
        actionName: '목 돌리기',
        actionType: 'stretching',
        actionCnt: 10,
        actionNum: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDel: 0,
      },
      {
        userId: 1,
        routineId: routineRows[0].id,
        actionName: '어깨 돌리기',
        actionType: 'stretching',
        actionCnt: 10,
        actionNum: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDel: 0,
      },
      {
        userId: 1,
        routineId: routineRows[0].id,
        actionName: '허리 돌리기',
        actionType: 'stretching',
        actionCnt: 10,
        actionNum: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDel: 0,
      },
      {
        userId: 1,
        routineId: routineRows[0].id,
        actionName: '무릎 돌리기',
        actionType: 'stretching',
        actionCnt: 10,
        actionNum: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDel: 0,
      },
      {
        userId: 1,
        routineId: routineRows[1].id,
        actionName: '스쿼트',
        actionType: 'body_exercise',
        actionCnt: 10,
        actionNum: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDel: 0,
      },
      {
        userId: 1,
        routineId: routineRows[1].id,
        actionName: '런지',
        actionType: 'body_exercise',
        actionCnt: 10,
        actionNum: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDel: 0,
      },
      {
        userId: 1,
        routineId: routineRows[1].id,
        actionName: '플랭크',
        actionType: 'body_exercise',
        actionCnt: 10,
        actionNum: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDel: 0,
      },
      {
        userId: 1,
        routineId: routineRows[1].id,
        actionName: '푸쉬업',
        actionType: 'body_exercise',
        actionCnt: 10,
        actionNum: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDel: 0,
      },
      {
        userId: 1,
        routineId: routineRows[2].id,
        actionName: '밀리터리 프레스',
        actionType: 'body_exercise',
        actionCnt: 10,
        actionNum: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDel: 0,
      },
      {
        userId: 1,
        routineId: routineRows[2].id,
        actionName: '컨벤셔널 데드리프트',
        actionType: 'body_exercise',
        actionCnt: 10,
        actionNum: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDel: 0,
      },
      {
        userId: 2,
        routineId: routineRows[3].id,
        actionName: '전신운동',
        actionType: 'body_exercise',
        actionCnt: 10,
        actionNum: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDel: 0,
      },
      {
        userId: 3,
        routineId: routineRows[4].id,
        actionName: '웨이트트레이닝',
        actionType: 'body_exercise',
        actionCnt: 10,
        actionNum: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDel: 0,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('actions', null, {});
  }
};
