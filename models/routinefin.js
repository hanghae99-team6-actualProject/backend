'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RoutineFin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.RoutineFin.belongsTo(models.Routine, { foreignKey: 'routineId', targetKey: 'id' });
      
    }
  };
  RoutineFin.init({
    routineId: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'RoutineFin',
  });
  return RoutineFin;
};