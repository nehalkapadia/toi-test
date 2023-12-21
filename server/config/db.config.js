
module.exports = {
  HOST: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
  PORT: process.env.DB_PORT ? process.env.DB_PORT : 1433,
  USER: process.env.DB_USERNAME ? process.env.DB_USERNAME : 'sa',
  PASSWORD: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'Neel@123',
  DB: process.env.DB_NAME ? process.env.DB_NAME : 'toi',
  dialect: process.env.DB_DIALECT ? process.env.DB_DIALECT : 'mssql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};