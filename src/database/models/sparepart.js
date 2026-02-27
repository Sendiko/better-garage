'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sparepart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      if (models.Garage) {
        Sparepart.belongsTo(models.Garage, { foreignKey: 'garageId', as: 'garage' });
      }
    }
  }
  Sparepart.init({
    name: DataTypes.STRING,
    partNumber: DataTypes.STRING,
    brand: DataTypes.STRING,
    category: DataTypes.STRING,
    garageId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Sparepart',
  });
  return Sparepart;
};