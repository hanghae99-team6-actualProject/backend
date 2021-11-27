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
      models.User.hasMany(models.Routine, { foreignKey: 'userId', sourceKey: 'id' });
      models.User.hasMany(models.Action, { foreignKey: 'userId', sourceKey: 'id' });
      models.User.hasMany(models.Character, { foreignKey: 'userId', sourceKey: 'id' });
      models.User.hasMany(models.Like, { foreignKey: 'userId', sourceKey: 'id' });
      models.User.hasMany(models.ExpDayLog, { foreignKey: 'userId', sourceKey: 'id' });
      models.User.hasMany(models.MoimUser, { foreignKey: 'userId', sourceKey: 'id' });
      models.User.hasMany(models.Comment, { foreignKey: 'userId', sourceKey: 'id' });
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
    refreshToken: {
      type: DataTypes.STRING,
    },
    nickName: DataTypes.STRING,
    userPw: DataTypes.STRING,
    provider: DataTypes.ENUM('local', 'google', 'naver', 'kakao'),
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