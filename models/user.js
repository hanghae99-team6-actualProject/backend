'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Routine, {foreignKey: 'userId', sourceKey: 'id', onDelete:'cascade'})
      models.User.hasMany(models.Character, {foreignKey: 'userId', sourceKey: 'id', onDelete:'cascade'})
    }
  };
  User.init({
    userEmail: {type: DataTypes.STRING,},
    nickName: DataTypes.STRING,
    userPw: DataTypes.STRING,
    provider: DataTypes.STRING,
    role: DataTypes.STRING,
    refreshToken: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  
  return User;
};