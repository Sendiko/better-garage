'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. Insert initial Garages
    await queryInterface.bulkInsert('Garages', [
      {
        name: 'Premium Auto Care',
        description: 'Full-service garage specializing in repairs and maintenance.',
        photoUrl: 'https://example.com/garages/premium-auto-care.jpg',
        bannerPhoto: 'https://example.com/garages/premium-auto-care-banner.jpg',
        address: '123 Premium Auto Way, Auto City',
        phone_number: '555-0100',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'City Garage',
        description: 'Reliable city auto repair shop with experienced technicians.',
        photoUrl: 'https://example.com/garages/city-garage.jpg',
        bannerPhoto: 'https://example.com/garages/city-garage-banner.jpg',
        address: '456 City Garage Blvd, Auto City',
        phone_number: '555-0200',
        createdAt: now,
        updatedAt: now
      }
    ], {});

    const garages = await queryInterface.sequelize.query(
      `SELECT id, name FROM Garages WHERE name IN ('Premium Auto Care', 'City Garage');`
    );

    const garageMap = {};
    garages[0].forEach(garage => {
      garageMap[garage.name] = garage.id;
    });

    // 2. Insert initial Services
    await queryInterface.bulkInsert('Services', [
      {
        name: 'Oil Change',
        description: 'Complete oil change with premium motor oil.',
        price: 25000,
        garageId: garageMap['Premium Auto Care'],
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Brake Inspection',
        description: 'Brake system inspection and safety check.',
        price: 18000,
        garageId: garageMap['Premium Auto Care'],
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Engine Tune-Up',
        description: 'Engine diagnostics and performance tune-up.',
        price: 45000,
        garageId: garageMap['City Garage'],
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Battery Replacement',
        description: 'Battery test and replacement with warranty.',
        price: 32000,
        garageId: garageMap['City Garage'],
        createdAt: now,
        updatedAt: now
      }
    ], {});

    // 3. Insert initial Spareparts
    await queryInterface.bulkInsert('Spareparts', [
      {
        name: 'Brake Pad Set',
        partNumber: 'BP-2001',
        brand: 'AutoSafe',
        category: 'Brakes',
        photoUrl: 'https://example.com/spareparts/brake-pad-set.jpg',
        price: 120000,
        garageId: garageMap['Premium Auto Care'],
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Air Filter',
        partNumber: 'AF-1500',
        brand: 'PureFlow',
        category: 'Filters',
        photoUrl: 'https://example.com/spareparts/air-filter.jpg',
        price: 55000,
        garageId: garageMap['Premium Auto Care'],
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Spark Plug',
        partNumber: 'SP-300',
        brand: 'IgnitePro',
        category: 'Ignition',
        photoUrl: 'https://example.com/spareparts/spark-plug.jpg',
        price: 25000,
        garageId: garageMap['City Garage'],
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Car Battery',
        partNumber: 'BT-8000',
        brand: 'PowerMax',
        category: 'Electrical',
        photoUrl: 'https://example.com/spareparts/car-battery.jpg',
        price: 350000,
        garageId: garageMap['City Garage'],
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Spareparts', {
      name: [
        'Brake Pad Set',
        'Air Filter',
        'Spark Plug',
        'Car Battery'
      ]
    }, {});

    await queryInterface.bulkDelete('Services', {
      name: [
        'Oil Change',
        'Brake Inspection',
        'Engine Tune-Up',
        'Battery Replacement'
      ]
    }, {});

    await queryInterface.bulkDelete('Garages', {
      name: ['Premium Auto Care', 'City Garage']
    }, {});
  }
};
