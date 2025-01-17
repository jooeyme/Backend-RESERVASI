'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'NIM',{ 
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'dept',{ 
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'alamat',{ 
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Bookings', 'desk_activity',{ 
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Bookings', 'dept',{ 
      type: Sequelize.STRING,
      allowNull: true,
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'NIM');
    await queryInterface.removeColumn('Users', 'dept');
    await queryInterface.removeColumn('Bookings', 'desk_activity');
    await queryInterface.removeColumn('Bookings', 'dept');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
