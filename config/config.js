const fs = require('fs');
const dbHost = process.env.DB_HOST || 'localhost'
module.exports = {
  development: {
      username: "admin",
      password: "password",
      database: "rip",
      host: dbHost,
      dialect: "postgres",
  },
};
