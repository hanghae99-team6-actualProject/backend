'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    // Add seed commands here.
    // Example:
    const actions = await queryInterface.sequelize.query(
      `SELECT id from Actions;`
    );

    const actionRows = actions[0];
    const actionRowsLength = actions[0].length

    await queryInterface.bulkInsert('actionfins', [
      {
        actionId: actionRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[3].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[4].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[5].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[6].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[7].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        actionId: actionRows[8].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('actionfins', null, {});
  }
};
