'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('IncomingLetters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      typeOfLetter: {
        type: Sequelize.ENUM,
        values: ['assignment','official','circular','invitation'],
        defaultValue: 'official'
      },
      numberOfLetter: {
        type: Sequelize.STRING
      },
      dateOfLetter: {
        type: Sequelize.DATE,
      },
      dateReceived: {
        type: Sequelize.DATE
      },
      sender: {
        type: Sequelize.STRING
      },
      receiver: {
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      summary: {
        type: Sequelize.TEXT
      },
      priority: {
        type: Sequelize.ENUM,
        values: ['urgent', 'soon', 'regular', 'can be delayed'],
        defaultValue: 'regular'
      },
      status: {
        type: Sequelize.ENUM,
        values: ['pending','disposition','rejected','approved','archive'],
        defaultValue: 'pending'
      },
      DispositionId: {
        type: Sequelize.INTEGER
      },
      attachments: {
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
    // Menambahkan indeks pada kolom-kolom penting
    await queryInterface.addIndex('IncomingLetters', ['typeOfLetter'], {
      name: 'idx_incomingletters_typeofletter',
    });

    await queryInterface.addIndex('IncomingLetters', ['status'], {
      name: 'idx_incomingletters_status',
    });

    await queryInterface.addIndex('IncomingLetters', ['priority'], {
      name: 'idx_incomingletters_priority',
    });
  },
  async down(queryInterface, Sequelize) {
    // Hapus indeks jika tabel dihapus
    await queryInterface.removeIndex('IncomingLetters', 'idx_incomingletters_typeofletter');
    await queryInterface.removeIndex('IncomingLetters', 'idx_incomingletters_status');
    await queryInterface.removeIndex('IncomingLetters', 'idx_incomingletters_priority');

    await queryInterface.dropTable('IncomingLetters');
  }
};