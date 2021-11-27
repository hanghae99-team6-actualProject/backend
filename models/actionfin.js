'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ActionFin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.ActionFin.belongsTo(models.Action, { foreignKey: 'actionId', targetKey: 'id' });
      // models.ActionFin.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
      models.ActionFin.belongsTo(models.RoutineFin, { foreignKey: 'routineFinId', targetKey: 'id' });
    }
  };
  ActionFin.init({
    actionId: DataTypes.INTEGER,
    routineFinId: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ActionFin',
  });
  return ActionFin;
};