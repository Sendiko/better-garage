'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'roleId', {
      type: Sequelize.INTEGER,
      allowNull: true, // or false if every user must have a role
      references: {
        model: 'Roles', // name of Target model table
        key: 'id',      // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // or 'RESTRICT'/'CASCADE' depending on your requirements
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'roleId');
  }
};
