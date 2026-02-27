'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      if (models.Services) {
        Transaction.belongsToMany(models.Services, {
          through: 'TransactionServices',
          as: 'services',
          foreignKey: 'transactionId',
          otherKey: 'serviceId'
        });
      }
      if (models.Sparepart) {
        Transaction.belongsToMany(models.Sparepart, {
          through: 'TransactionSpareparts',
          as: 'spareparts',
          foreignKey: 'transactionId',
          otherKey: 'sparepartId'
        });
      }
    }
  }
  Transaction.init({
    bookingId: DataTypes.UUID,
    customerId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    serviceTotal: DataTypes.INTEGER,
    sparepartsTotal: DataTypes.INTEGER,
    grandTotal: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};