'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Services', 'category', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Services', 'icon', {
      type: Sequelize.ENUM('oil', 'hammer', 'engine', 'tire', 'sweep'),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Services', 'icon');
    await queryInterface.removeColumn('Services', 'category');
  }
};
