'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MoimUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.MoimUser.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
      models.MoimUser.belongsTo(models.Moim, { foreignKey: 'moimId', targetKey: 'id' });
    }
  };
  MoimUser.init({
    userId: DataTypes.INTEGER,
    moimId: DataTypes.INTEGER,
    host: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'MoimUser',
  });
  return MoimUser;
};