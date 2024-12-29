'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Bookings', [
      {
        user_id: 2,
        room_id: 'M01',
        tool_id: null,
        peminjam: 'jepriadi',
        kontak: '+62082234949709',
        booking_date: '2024-04-12',
        start_time: '08:30:00',
        end_time: '11:30:00',
        booking_status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 2,
        room_id: null,
        tool_id: 'H03',
        peminjam: 'jepriadi',
        kontak: '+62082234949709',
        booking_date: '2024-04-12',
        start_time: '08:30:00',
        end_time: '11:30:00',
        booking_status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     * 
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
