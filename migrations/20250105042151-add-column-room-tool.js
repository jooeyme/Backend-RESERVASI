'use strict';

const { values } = require('pdf-lib');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Rooms', 'require_double_verification', {
      type: Sequelize.BOOLEAN,
      defaultValue: false, // Default: memerlukan 2x verifikasi
      allowNull: false,
    });
    
    await queryInterface.addColumn('Rooms', 'type', {
      type: Sequelize.ENUM,
      values: ['lab', 'class', 'meeting'],
      default: 'class'
    }) 

    await queryInterface.addColumn('Tools', 'type', {
      type: Sequelize.ENUM,
      values: ['lab', 'multimedia'],
      default: 'lab'
    }) 

    await queryInterface.addColumn('Tools', 'require_double_verification', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Rooms', 'require_double_verification');
    await queryInterface.removeColumn('Tools', 'require_double_verification');
    await queryInterface.removeColumn('Rooms', 'type');
    await queryInterface.removeColumn('Tools', 'type')
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
