const { Sequelize } = require("sequelize");
const config = require("./config")[env];
require("dotenv").config();

const env = process.env.NODE_ENV || "development";


let sequelize;

 if (config.use_env_variable) {
  console.log("Using environment variable")
  sequelize = new Sequelize(process.env[config.use_env_variable],{
    dialect: config.dialect,
    dialectOptions: config.dialectOptions || {},
  });
 } else{
  const { username, password, database, host, dialect } = config[env];
  sequelize = new Sequelize(database, username, password, {
   host: host,
   dialect: dialect,
 
})};
// let sequelize;
// if (config.use_env_variable){
//   sequelize = new Sequelize(process.env[config.use_env_variable], {
//     dialect: config.dialect,
//     dialectOptions: {
//       ssl: {
//           require: true, // Wajib SSL
//           rejectUnauthorized: false, // Abaikan sertifikat self-signed
//       },
//   },
//   });
// } else {
//   sequelize = new Sequelize(
//     config.database,
//     config.username,
//     config.password,
//     {
//       host: config.host,
//       dialect: config.dialect,
//     }
//   );
// }


module.exports = sequelize;

// Coba koneksi ke database
async function testDBConnection() {
  try {
    await sequelize.authenticate();
    console.log("Koneksi ke database berhasil.");
  } catch (error) {
    console.error("Gagal terkoneksi ke database:", error);
  }
}

testDBConnection();