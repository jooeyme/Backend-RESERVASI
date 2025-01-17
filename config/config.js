
require('dotenv').config(); // Memuat .env

module.exports = {
  development: {
    username: "postgres",
    password: "admin",
    database: "manhut_db",
    host: "localhost",
    dialect: "postgres"
  },
  test: {
    username: "postgres",
    password: "admin",
    database: "manhut_db",
    host: "localhost",
    dialect: "postgres"
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }

  }
}
