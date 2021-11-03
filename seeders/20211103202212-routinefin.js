'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    // Add seed commands here. 
    // Example:
    const routines = await queryInterface.sequelize.query(
      `SELECT id from Routines;`
    );
    const routineRows = routines[0];

    await queryInterface.bulkInsert('routinefins', [
      {
        routindId: routineRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('routinefins', null, {});
  }
};
