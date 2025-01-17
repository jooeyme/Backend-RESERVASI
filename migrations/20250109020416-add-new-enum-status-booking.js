'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Bookings_booking_status" ADD VALUE 'moved';`);
  
  },

  async down (queryInterface, Sequelize) {
    console.log("Rollback for enum values is not directly supported.");
    
  }
};
