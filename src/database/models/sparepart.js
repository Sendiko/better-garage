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
      if (models.Transaction) {
        Sparepart.belongsToMany(models.Transaction, {
          through: 'TransactionSpareparts',
          as: 'transactions',
          foreignKey: 'sparepartId',
          otherKey: 'transactionId'
        });
      }
    }
  }
  Sparepart.init({
    name: DataTypes.STRING,
    partNumber: DataTypes.STRING,
    brand: DataTypes.STRING,
    category: DataTypes.STRING,
    photoUrl: DataTypes.STRING,
    price: DataTypes.INTEGER,
    garageId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Sparepart',
  });
  return Sparepart;
};