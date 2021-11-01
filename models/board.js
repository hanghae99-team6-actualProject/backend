'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Board.hasMany(models.Like, { foreignKey: 'boardId', sourceKey: 'id', onDelete: 'cascade' });
    }
  };
  Board.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Board',
  });
  return Board;
};