'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Chat.belongsTo(models.MoimUser, { foreignKey: 'moimUserId', targetKey: 'id', onDelete: 'cascade' });
      models.Chat.belongsTo(models.MoimChatRoom, { foreignKey: 'moimChatRoomId', targetKey: 'id', onDelete: 'cascade' });
    }
  };
  Chat.init({
    moimUserId: {
      require: true,
      type: DataTypes.INTEGER,
    },
    moimChatRoomId: {
      require: true,
      type: DataTypes.INTEGER,
    },
    contents: {
      require: true,
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};