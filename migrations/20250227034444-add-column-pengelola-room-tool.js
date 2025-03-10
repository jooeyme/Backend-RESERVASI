'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Rooms', 'pengelola', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Tools', 'pengelola', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Rooms', 'pengelola');
    await queryInterface.removeColumn('Tools', 'pengelola');
    
  }
};
