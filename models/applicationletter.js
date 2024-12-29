'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class applicationLetter extends Model {
    /**
     * Helper method for defining associations. 
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  applicationLetter.init({
    formName: DataTypes.STRING,
    nim: DataTypes.STRING,
    formData: DataTypes.JSONB,
    path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'applicationLetter',
  });
  return applicationLetter;
};