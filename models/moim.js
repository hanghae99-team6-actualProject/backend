'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Moim extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Moim.hasMany(models.Like, { foreignKey: 'moimId', sourceKey: 'id', onDelete: 'cascade' });
    }
  };
  Moim.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Moim',
  });
  return Moim;
};