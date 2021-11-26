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
      models.Moim.hasMany(models.MoimUser, { foreignKey: 'moimId', sourceKey: 'id' });
      models.Moim.hasMany(models.Comment, { foreignKey: 'moimId', sourceKey: 'id' });
      models.Moim.hasMany(models.Like, { foreignKey: 'moimId', sourceKey: 'id' });
      models.Moim.hasMany(models.Notice, { foreignKey: 'moimId', sourceKey: 'id' });
    }
  };
  Moim.init({
    title: DataTypes.STRING,
    contents: DataTypes.STRING,
    imgSrc: DataTypes.STRING,
    location: DataTypes.STRING,
    filter: DataTypes.STRING,
    startAt: DataTypes.DATE,
    finishAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Moim',
  });
  return Moim;
};