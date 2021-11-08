'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    // Add seed commands here.
    // Example:
    const actions = await queryInterface.sequelize.query(
      `SELECT id from Actions;`
    );

    const routineFins = await queryInterface.sequelize.query(
      `SELECT id from RoutineFins;`
    );

    const actionRows = actions[0];
    const actionRowsLength = actions[0].length
    const routineFinRows = routineFins[0];

    await queryInterface.bulkInsert('actionfins', [
      {
        actionId: actionRows[0].id,
        routineFinId: routineFinRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[1].id,
        routineFinId: routineFinRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[2].id,
        routineFinId: routineFinRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[3].id,
        routineFinId: routineFinRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[4].id,
        routineFinId: routineFinRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[5].id,
        routineFinId: routineFinRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[6].id,
        routineFinId: routineFinRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[7].id,
        routineFinId: routineFinRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[8].id,
        routineFinId: routineFinRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[9].id,
        routineFinId: routineFinRows[0].id,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[10].id,
        routineFinId: routineFinRows[0].id,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('actionfins', null, {});
  }
};
