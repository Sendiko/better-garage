'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      if (models.Role) {
        User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
      }
      if (models.Garage) {
        User.belongsTo(models.Garage, { foreignKey: 'garageId', as: 'garage' });
      }
    }
  }
  User.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    photoUrl: DataTypes.STRING,
    phone: DataTypes.STRING,
    roleId: DataTypes.INTEGER,
    garageId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};