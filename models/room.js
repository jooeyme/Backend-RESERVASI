'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Booking, 
        { foreignKey: 'room_id', sourceKey: 'room_id' }
        );
    }
  }
  Room.init({
    room_id: DataTypes.STRING,
    name_room: DataTypes.STRING,
    alamat_room: DataTypes.STRING,
    kapasitas: DataTypes.STRING,
    luas: DataTypes.STRING,
    deskripsi_room: DataTypes.TEXT,
    fasilitas: DataTypes.TEXT,
    gambar_room: DataTypes.STRING,
    require_double_verification: DataTypes.BOOLEAN,
    type: DataTypes.ENUM('lab', 'class', 'meeting'),
    pengelola: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};