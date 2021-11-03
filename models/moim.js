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
      models.Moim.hasMany(models.MoimUser, { foreignKey: 'moimId', sourceKey: 'id', onDelete: 'cascade' });
      models.Moim.hasMany(models.Comment, { foreignKey: 'moimId', sourceKey: 'id', onDelete: 'cascade' });
      models.Moim.hasMany(models.Like, { foreignKey: 'moimId', sourceKey: 'id', onDelete: 'cascade' });
    }
  };
  Moim.init({
    title: DataTypes.STRING,
    contents: DataTypes.STRING,
    imgSrc: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Moim',
  });
  return Moim;
};