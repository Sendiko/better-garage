'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const bookingIdOne = '00000000-0000-0000-0000-000000000001';
    const bookingIdTwo = '00000000-0000-0000-0000-000000000002';

    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM Users WHERE email IN ('bob@garage.com', 'charlie@garage.com');`
    );

    const userMap = {};
    users[0].forEach(user => {
      userMap[user.email] = user.id;
    });

    const services = await queryInterface.sequelize.query(
      `SELECT id, name FROM Services WHERE name IN ('Oil Change', 'Brake Inspection', 'Engine Tune-Up', 'Battery Replacement');`
    );
    const serviceMap = {};
    services[0].forEach(service => {
      serviceMap[service.name] = service.id;
    });

    const spareparts = await queryInterface.sequelize.query(
      `SELECT id, name FROM Spareparts WHERE name IN ('Brake Pad Set', 'Air Filter', 'Spark Plug', 'Car Battery');`
    );
    const sparepartMap = {};
    spareparts[0].forEach(part => {
      sparepartMap[part.name] = part.id;
    });

    await queryInterface.bulkInsert('Transactions', [
      {
        bookingId: bookingIdOne,
        customerId: userMap['charlie@garage.com'],
        technicianId: userMap['bob@garage.com'],
        status: 'booked',
        vehicleName: 'Honda Civic',
        vehiclePlate: 'B 1234 ABC',
        bookingTime: now,
        serviceTotal: 43000,
        sparepartsTotal: 120000,
        grandTotal: 163000,
        createdAt: now,
        updatedAt: now
      },
      {
        bookingId: bookingIdTwo,
        customerId: userMap['charlie@garage.com'],
        technicianId: userMap['bob@garage.com'],
        status: 'ongoing',
        vehicleName: 'Toyota Corolla',
        vehiclePlate: 'D 5678 DEF',
        bookingTime: now,
        serviceTotal: 77000,
        sparepartsTotal: 375000,
        grandTotal: 452000,
        createdAt: now,
        updatedAt: now
      }
    ], {});

    const transactions = await queryInterface.sequelize.query(
      `SELECT id, bookingId FROM Transactions WHERE bookingId IN ('${bookingIdOne}', '${bookingIdTwo}')`
    );
    const transactionMap = {};
    transactions[0].forEach(tx => {
      transactionMap[tx.bookingId] = tx.id;
    });

    await queryInterface.bulkInsert('TransactionServices', [
      {
        transactionId: transactionMap[bookingIdOne],
        serviceId: serviceMap['Oil Change'],
        createdAt: now,
        updatedAt: now
      },
      {
        transactionId: transactionMap[bookingIdOne],
        serviceId: serviceMap['Brake Inspection'],
        createdAt: now,
        updatedAt: now
      },
      {
        transactionId: transactionMap[bookingIdTwo],
        serviceId: serviceMap['Engine Tune-Up'],
        createdAt: now,
        updatedAt: now
      },
      {
        transactionId: transactionMap[bookingIdTwo],
        serviceId: serviceMap['Battery Replacement'],
        createdAt: now,
        updatedAt: now
      }
    ], {});

    await queryInterface.bulkInsert('TransactionSpareparts', [
      {
        transactionId: transactionMap[bookingIdOne],
        sparepartId: sparepartMap['Brake Pad Set'],
        createdAt: now,
        updatedAt: now
      },
      {
        transactionId: transactionMap[bookingIdOne],
        sparepartId: sparepartMap['Air Filter'],
        createdAt: now,
        updatedAt: now
      },
      {
        transactionId: transactionMap[bookingIdTwo],
        sparepartId: sparepartMap['Spark Plug'],
        createdAt: now,
        updatedAt: now
      },
      {
        transactionId: transactionMap[bookingIdTwo],
        sparepartId: sparepartMap['Car Battery'],
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    const bookingIdOne = '00000000-0000-0000-0000-000000000001';
    const bookingIdTwo = '00000000-0000-0000-0000-000000000002';

    const transactions = await queryInterface.sequelize.query(
      `SELECT id FROM Transactions WHERE bookingId IN ('${bookingIdOne}', '${bookingIdTwo}')`
    );
    const transactionIds = transactions[0].map(tx => tx.id);

    if (transactionIds.length > 0) {
      await queryInterface.bulkDelete('TransactionServices', {
        transactionId: transactionIds
      }, {});

      await queryInterface.bulkDelete('TransactionSpareparts', {
        transactionId: transactionIds
      }, {});

      await queryInterface.bulkDelete('Transactions', {
        bookingId: [bookingIdOne, bookingIdTwo]
      }, {});
    }
  }
};
