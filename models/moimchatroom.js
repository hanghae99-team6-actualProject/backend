'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MoimChatRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.MoimChatRoom.hasMany(models.Chat, { foreignKey: 'moimChatRoomId', sourceKey: 'id' });
      models.MoimChatRoom.hasMany(models.MoimChatUser, { foreignKey: 'moimChatRoomId', sourceKey: 'id' });
      models.MoimChatRoom.hasMany(models.Notice, { foreignKey: 'moimChatRoomId', sourceKey: 'id' });
      models.MoimChatRoom.belongsTo(models.Moim, { foreignKey: 'moimId', targetKey: 'id', onDelete: 'cascade' });

    }
  };
  MoimChatRoom.init({
    moimId: DataTypes.INTEGER,
    deleteAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'MoimChatRoom',
  });
  return MoimChatRoom;
};