'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IncomingLetter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  IncomingLetter.init({
    typeOfLetter: DataTypes.ENUM('assignment','official','circular','invitation'),
    numberOfLetter: DataTypes.STRING,
    dateOfLetter: DataTypes.DATE,
    dateReceived: DataTypes.DATE,
    sender: DataTypes.STRING,
    receiver: DataTypes.STRING,
    subject: DataTypes.STRING,
    summary: DataTypes.TEXT,
    priority: DataTypes.ENUM('urgent', 'soon', 'regular', 'can be delayed'),
    status: DataTypes.ENUM('pending','disposition','rejected','approved','archive'),
    DispositionId: DataTypes.INTEGER,
    attachments: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'IncomingLetter',
  });
  return IncomingLetter;
};