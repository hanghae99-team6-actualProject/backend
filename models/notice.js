'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Notice.belongsTo(models.Moim, { foreignKey: 'moimId', targetKey: 'id', onDelete: 'cascade' });
      models.Notice.belongsTo(models.MoimChatRoom, { foreignKey: 'moimChatRoomId', targetKey: 'id', onDelete: 'cascade' });
    }
  };
  Notice.init({
    moimId: {
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
    modelName: 'Notice',
  });
  return Notice;
};