'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Like.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', onDelete: 'cascade' });
      models.Like.belongsTo(models.Moim, { foreignKey: 'moimId', targetKey: 'id', onDelete: 'cascade' });
    }
  };
  Like.init({
    userId: DataTypes.INTEGER,
    moimId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};