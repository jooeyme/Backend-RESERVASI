'use strict';

const { toDefaultValue } = require('sequelize/lib/utils');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tools', 'jumlah');

    await queryInterface.addColumn('Tools', 'jumlah', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Tools', 'jumlah', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.removeColumn('Tools', 'jumlah');

  }
};
