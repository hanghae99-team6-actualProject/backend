'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Action extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Action.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
      models.Action.belongsTo(models.Routine, { foreignKey: 'routineId', targetKey: 'id' });
      models.Action.hasMany(models.ActionFin, { foreignKey: 'actionId', sourceKey: 'id', onDelete: 'cascade' });
    }
  };
  Action.init({
    userId: DataTypes.INTEGER,
    routineId: DataTypes.INTEGER,
    actionName: DataTypes.STRING,
    actionType: DataTypes.STRING,
    actionCnt: DataTypes.INTEGER,
    actionNum: DataTypes.INTEGER,
    actionType: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Action',
  });
  return Action;
};