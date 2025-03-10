'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tool extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Booking, 
        { foreignKey: 'tool_id', sourceKey: 'tool_id' }
        );
    }
  }
  Tool.init({
    tool_id: DataTypes.STRING,
    name_tool: DataTypes.STRING,
    alamat_tool: DataTypes.STRING,
    kondisi: DataTypes.STRING,
    jumlah: DataTypes.INTEGER,
    deskripsi: DataTypes.TEXT,
    gambar_tool: DataTypes.STRING,
    require_double_verification: DataTypes.BOOLEAN,
    type: DataTypes.ENUM('lab', 'multimedia'),
    pengelola: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Tool',
  });
  return Tool;
};