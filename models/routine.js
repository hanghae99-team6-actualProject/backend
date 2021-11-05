'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Routine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Routine.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
      models.Routine.hasMany(models.Action, { foreignKey: 'routineId', sourceKey: 'id' });
      models.Routine.hasMany(models.RoutineFin, { foreignKey: 'routineId', sourceKey: 'id', onDelete: 'cascade' });
    }
  };
  Routine.init({
    userId: DataTypes.INTEGER,
    routineName: DataTypes.STRING,
    isMain: DataTypes.INTEGER,
    preSet: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Routine',
  });
  return Routine;
};