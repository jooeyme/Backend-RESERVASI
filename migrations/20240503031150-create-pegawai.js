'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pegawais', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      NIP: {
        type: Sequelize.INTEGER
      },
      KPE: {
        type: Sequelize.STRING
      },
      NIDN: {
        type: Sequelize.STRING
      },
      agama: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.ENUM,
        values: ['Laki-laki','Perempuan'],
        defaultValue: 'Laki-laki',
      },
      nokarpeg: {
        type: Sequelize.STRING
      },
      lahir: {
        type: Sequelize.STRING
      },
      ttl: {
        type: Sequelize.DATE
      },
      umur: {
        type: Sequelize.INTEGER
      },
      jabatan: {
        type: Sequelize.STRING
      },
      TMT_jb: {
        type: Sequelize.DATE
      },
      KUM_jb: {
        type: Sequelize.STRING
      },
      satyalancana: {
        type: Sequelize.STRING
      },
      gol_pns: {
        type: Sequelize.STRING
      },
      TMT_pns: {
        type: Sequelize.DATE
      },
      gol_pk: {
        type: Sequelize.STRING
      },
      TMT_pk: {
        type: Sequelize.DATE
      },
      pendidikan: {
        type: Sequelize.STRING
      },
      pensiun: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Pegawais');
  }
};