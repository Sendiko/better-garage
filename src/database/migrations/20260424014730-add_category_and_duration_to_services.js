'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Services', 'category', {
      type: Sequelize.ENUM('Oil', 'Tire', 'Repair', 'Engine', 'Interior Cleaning'),
      allowNull: true,
    });
    await queryInterface.addColumn('Services', 'estimatedDuration', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Estimated duration in minutes'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Services', 'category');
    await queryInterface.removeColumn('Services', 'estimatedDuration');
  }
};
