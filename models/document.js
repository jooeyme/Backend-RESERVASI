'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Pegawai, 
        { foreignKey: 'employee_id', targetKey: 'NIP' }
        );
    }
  }
  Document.init({
    employee_id: DataTypes.INTEGER,
    document_name: DataTypes.STRING,
    document_type: DataTypes.STRING,
    upload_date: DataTypes.DATE,
    file_path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Document',
    hooks: {
      beforeCreate: (document) => {
          document.upload_date = document.createdAt; // Set upload_date saat pertama kali dibuat
      },
      beforeUpdate: (document) => {
          document.upload_date = document.updatedAt; // Set upload_date saat dokumen diedit
      }
  }
  });
  return Document;
};