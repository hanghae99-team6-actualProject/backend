'use strict';
const Sequelize = require("sequelize");
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
    }
  };
  User.init({
    providerId: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    userEmail: {
      allowNull: false,
      type: DataTypes.STRING,
      require: true,
    },
    nickName: DataTypes.STRING,
    userPw: DataTypes.STRING,
    provider: DataTypes.ENUM('local', 'google', 'naver', 'kakao'),
    exp: DataTypes.INTEGER,
    role: DataTypes.ENUM('admin', 'base_user', 'guest'),
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true,
    timestamps: true,
  });
  return User;
};