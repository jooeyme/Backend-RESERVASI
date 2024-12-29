'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AcademicLetter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AcademicLetter.init({
    number: DataTypes.STRING,
    sender: DataTypes.STRING,
    dateReceived: DataTypes.DATE,
    title: DataTypes.STRING,
    attachments: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AcademicLetter',
  });
  return AcademicLetter;
};