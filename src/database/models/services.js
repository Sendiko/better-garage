'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Services extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      if (models.Garage) {
        Services.belongsTo(models.Garage, { foreignKey: 'garageId', as: 'garage' });
      }
      if (models.Transaction) {
        Services.belongsToMany(models.Transaction, {
          through: 'TransactionServices',
          as: 'transactions',
          foreignKey: 'serviceId',
          otherKey: 'transactionId'
        });
      }
    }
  }
  Services.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    garageId: DataTypes.INTEGER,
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    icon: {
      type: DataTypes.ENUM('oil', 'tire', 'hammer', 'engine', 'sweep'),
      allowNull: true
    },
    estimatedDuration: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Services',
  });
  return Services;
};