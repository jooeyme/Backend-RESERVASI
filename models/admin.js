'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Booking, { foreignKey: 'id' });
    }
  }
  Admin.init({
    username_admn: DataTypes.STRING,
    email_admn: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('super_admin', 'admin', 'admin_staff', 'admin_leader', 'admin_tu', 'admin_mm'),
  }, {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};