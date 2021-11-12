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
        routineId: 1,
        cycle: 0,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        routineId: 2,
        cycle: 0,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        routineId: 3,
        cycle: 0,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        routineId: 3,
        cycle: 1,
        date: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('routinefins', null, {});
  }
};
