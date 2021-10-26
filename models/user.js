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
    }
  };
  User.init({
    userEmail: {type: DataTypes.STRING,},
    nickName: DataTypes.STRING,
    userPw: DataTypes.STRING,
    provider: DataTypes.STRING,
    exp: DataTypes.INTEGER,
    delType: DataTypes.INTEGER,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  
  return User;
};