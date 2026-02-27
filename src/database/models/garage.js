'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Garage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      if (models.User) {
        Garage.hasMany(models.User, { foreignKey: 'garageId', as: 'users' });
      }
      if (models.Services) {
        Garage.hasMany(models.Services, { foreignKey: 'garageId', as: 'services' });
      }
      if (models.Sparepart) {
        Garage.hasMany(models.Sparepart, { foreignKey: 'garageId', as: 'spareparts' });
      }
    }
  }
  Garage.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    photoUrl: DataTypes.STRING,
    bannerPhoto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Garage',
  });
  return Garage;
};