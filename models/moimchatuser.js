'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MoimChatUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.MoimChatUser.belongsTo(models.MoimUser, { foreignKey: 'moimUserId', targetKey: 'id', onDelete: 'cascade' });
      models.MoimChatUser.belongsTo(models.MoimChatRoom, { foreignKey: 'moimChatRoomId', targetKey: 'id', onDelete: 'cascade' });
    }
  };
  MoimChatUser.init({
    moimUserId: DataTypes.INTEGER,
    moimChatRoomId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'MoimChatUser',
  });
  return MoimChatUser;
};