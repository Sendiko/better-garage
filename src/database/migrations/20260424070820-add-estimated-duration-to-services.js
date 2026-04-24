'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Services');

    if (!tableInfo.estimatedDuration) {
      await queryInterface.addColumn('Services', 'estimatedDuration', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Services');
    
    if (tableInfo.estimatedDuration) {
      await queryInterface.removeColumn('Services', 'estimatedDuration');
    }
  }
};
