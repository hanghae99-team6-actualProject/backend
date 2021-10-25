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
    }
  };
  Action.init({
    userId: DataTypes.INTEGER,
    routineId: DataTypes.INTEGER,
    actionName: DataTypes.STRING,
    actionCount: DataTypes.INTEGER,
    finDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Action',
  });
  return Action;
};