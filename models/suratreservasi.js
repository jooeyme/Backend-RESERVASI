'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SuratReservasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, 
        { foreignKey: 'user_id' }
        );
    }
  }
  SuratReservasi.init({
    user_id: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SuratReservasi',
  });
  return SuratReservasi;
};