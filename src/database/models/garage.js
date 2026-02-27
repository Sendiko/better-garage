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
      // define association here
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