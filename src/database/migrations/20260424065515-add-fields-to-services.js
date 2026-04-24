'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Services');

    if (!tableInfo.category) {
      await queryInterface.addColumn('Services', 'category', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableInfo.icon) {
      await queryInterface.addColumn('Services', 'icon', {
        type: Sequelize.ENUM('oil', 'hammer', 'engine', 'tire', 'sweep'),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Services');
    
    if (tableInfo.icon) {
      await queryInterface.removeColumn('Services', 'icon');
    }
    if (tableInfo.category) {
      await queryInterface.removeColumn('Services', 'category');
    }
  }
};
