'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      room_id: {
        type: Sequelize.STRING
      },
      alat_id: {
        type: Sequelize.STRING
      },
      peminjam: {
        type: Sequelize.STRING
      },
      kontak: {
        type: Sequelize.STRING
      },
      booking_date: {
        type: Sequelize.DATE
      },
      start_time: {
        type: Sequelize.TIME
      },
      end_time: {
        type: Sequelize.TIME
      },
      booking_status: {
        type: Sequelize.ENUM,
        values: ['pending', 'approved', 'rejected', 'returned', 'moved'],
        defaultValue: 'pending'
      },
      verified_admin_lab: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      verified_admin_room: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      verified_admin_leader: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      verified_admin_tu: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      jenis_pengguna: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      jenis_kegiatan: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};