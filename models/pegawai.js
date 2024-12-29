'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pegawai extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Document, 
        { foreignKey: 'NIP', targetKey: 'employee_id' }
        );
    }
  }
  Pegawai.init({
    name: DataTypes.STRING,
    NIP: DataTypes.INTEGER,
    KPE: DataTypes.STRING,
    NIDN: DataTypes.STRING,
    agama: DataTypes.STRING,
    gender: DataTypes.ENUM('Laki-laki','Perempuan'),
    nokarpeg: DataTypes.STRING,
    lahir: DataTypes.STRING,
    ttl: DataTypes.DATE,
    umur: DataTypes.INTEGER,
    jabatan: DataTypes.STRING,
    TMT_jb: DataTypes.DATE,
    KUM_jb: DataTypes.STRING,
    satyalancana: DataTypes.STRING,
    gol_pns: DataTypes.STRING,
    TMT_pns: DataTypes.DATE,
    gol_pk: DataTypes.STRING,
    TMT_pk: DataTypes.DATE,
    pendidikan: DataTypes.STRING,
    pensiun: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pegawai',
  });
  return Pegawai;
};