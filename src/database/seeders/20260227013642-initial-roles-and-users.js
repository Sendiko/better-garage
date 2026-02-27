'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Insert Roles
    await queryInterface.bulkInsert('Roles', [
      { name: 'Admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Technician', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Customer', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // Get the inserted roles to use their IDs
    const roles = await queryInterface.sequelize.query(
      `SELECT id, name from Roles;`
    );

    const roleMap = {};
    roles[0].forEach(role => {
      roleMap[role.name] = role.id;
    });

    // Hash a common password for all seed users ('password123')
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 2. Insert Users
    await queryInterface.bulkInsert('Users', [
      {
        fullName: 'Admin User',
        email: 'admin@garage.com',
        password: hashedPassword,
        phone: '1234567890',
        roleId: roleMap['Admin'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Tech Bob',
        email: 'bob@garage.com',
        password: hashedPassword,
        phone: '0987654321',
        roleId: roleMap['Technician'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Customer Charlie',
        email: 'charlie@garage.com',
        password: hashedPassword,
        phone: '5555555555',
        roleId: roleMap['Customer'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
