'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExpDayLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      models.ExpDayLog.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', onDelete: 'cascade' });
    }
  };
  ExpDayLog.init({
    userId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    totalExp: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ExpDayLog'
  });
  return ExpDayLog;
};