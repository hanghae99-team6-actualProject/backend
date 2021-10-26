'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      providerId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      userEmail: {
        type: Sequelize.STRING,
      },
      nickName: {
        type: Sequelize.STRING
      },
      userPw: {
        type: Sequelize.STRING
      },
      provider: {
        type: Sequelize.ENUM('local', 'google', 'naver', 'kakao')
      },
      exp: {
        type: Sequelize.INTEGER
      },
      role: {
        type: Sequelize.ENUM('admin', 'base_user', 'guest')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};