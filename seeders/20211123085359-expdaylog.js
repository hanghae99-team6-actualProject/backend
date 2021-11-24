'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    //  Add seed commands here.
    //  Example:
    await queryInterface.bulkInsert('expdaylogs', [
      {
        userId: 2,
        date: new Date(),
        totalExp: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        date: new Date(),
        totalExp: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('expdaylogs', null, {});
  }
};
