'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RoutineFin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
<<<<<<< HEAD
      models.RoutineFin.belongsTo(models.Routine, { foreignKey: 'routineId', targetKey: 'id' });
=======
      // models.RoutineFin.belongsTo(models.Routine, { foreignKey: 'routineId', targetKey: 'id' });
      models.RoutineFin.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
>>>>>>> 임성찬
      models.RoutineFin.hasMany(models.ActionFin, { foreignKey: 'routineFinId', sourceKey: 'id' });
    }
  };
  RoutineFin.init({
    userId: DataTypes.INTEGER,
    routineId: DataTypes.INTEGER,
    cycle: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'RoutineFin',
  });
  return RoutineFin;
};