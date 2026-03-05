'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Transactions', 'bookingTime', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.changeColumn('Transactions', 'status', {
      type: Sequelize.ENUM('booked', 'received', 'ongoing', 'finished', 'payed'),
      defaultValue: 'booked'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Transactions', 'status', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.removeColumn('Transactions', 'bookingTime');
  }
};
