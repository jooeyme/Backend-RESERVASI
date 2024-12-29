'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Admin, 
        { foreignKey: 'id' }
        );

      this.belongsTo(models.Room, 
        { foreignKey: 'room_id', targetKey: 'room_id' }
        );
      
      this.belongsTo(models.Tool, 
        { foreignKey: 'tool_id', targetKey: 'tool_id' }
        );
      
      this.belongsTo(models.User, 
        { foreignKey: 'user_id' }
        );
    }
  }
  Booking.init({
    user_id: DataTypes.INTEGER,
    room_id: DataTypes.STRING,
    tool_id: DataTypes.STRING,
    peminjam: DataTypes.STRING,
    kontak: DataTypes.STRING,
    booking_date: DataTypes.DATE,
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME,
    booking_status: DataTypes.ENUM('pending', 'approved', 'rejected', 'returned'),
    desk_activity: DataTypes.STRING,
    dept: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    note: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};