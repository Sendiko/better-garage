'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'garageId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Garages', // Name of the target table
        key: 'id', // Key in the target table
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'garageId');
  }
};
