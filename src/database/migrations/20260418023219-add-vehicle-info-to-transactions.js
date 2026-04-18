'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Transactions', 'vehicleName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Transactions', 'vehiclePlate', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Transactions', 'vehicleName');
    await queryInterface.removeColumn('Transactions', 'vehiclePlate');
  }
};
