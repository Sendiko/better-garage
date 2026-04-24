'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change category enum
    await queryInterface.changeColumn('Services', 'category', {
      type: Sequelize.ENUM('oil', 'tire', 'hammer', 'engine', 'sweep'),
      allowNull: true,
    });

    // Add icon column
    await queryInterface.changeColumn('Services', 'icon', {
      type: Sequelize.ENUM('oil', 'tire', 'hammer', 'engine', 'sweep'),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove icon column
    await queryInterface.removeColumn('Services', 'icon');

    // Revert category enum
    await queryInterface.changeColumn('Services', 'category', {
      type: Sequelize.ENUM('Oil', 'Tire', 'Repair', 'Engine', 'Interior Cleaning'),
      allowNull: true,
    });
  }
};
