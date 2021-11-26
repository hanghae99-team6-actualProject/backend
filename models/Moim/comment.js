'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comment.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', onDelete: 'cascade' });
      models.Comment.belongsTo(models.Moim, { foreignKey: 'moimId', targetKey: 'id', onDelete: 'cascade' });
    }
  };
  Comment.init({
    userId: DataTypes.INTEGER,
    moimId: DataTypes.INTEGER,
    contents: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};