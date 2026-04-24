'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Services', 'category', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Services', 'category', {
      type: Sequelize.ENUM('oil', 'tire', 'hammer', 'engine', 'sweep'),
      allowNull: true,
    });
  }
};
