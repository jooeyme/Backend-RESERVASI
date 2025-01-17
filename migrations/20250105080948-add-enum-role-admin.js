'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Admins_role" ADD VALUE 'admin_leader';`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Admins_role" ADD VALUE 'admin_tu';`);
    
  },

  async down (queryInterface, Sequelize) {
    console.log("Rollback for enum values is not directly supported.");
    
  }
};