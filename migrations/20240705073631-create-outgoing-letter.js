'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OutgoingLetters', {
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
      dateSend: {
        type: Sequelize.DATE
      },
      addressee: {
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
    await queryInterface.addIndex('OutgoingLetters', ['typeOfLetter'], {
      name: 'idx_outgoingletter_typeofletter',
    });

    await queryInterface.addIndex('OutgoingLetters', ['status'], {
      name: 'idx_outgoingletters_status',
    });

    await queryInterface.addIndex('OutgoingLetters', ['priority'], {
      name: 'idx_outgoingletters_priority',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('OutgoingLetters', 'idx_outgoingletters_typeofletter');
    await queryInterface.removeIndex('OutgoingLetters', 'idx_outgoingletters_status');
    await queryInterface.removeIndex('OutgoingLetters', 'idx_outgoingletters_priority');

    await queryInterface.dropTable('OutgoingLetters');
  }
};