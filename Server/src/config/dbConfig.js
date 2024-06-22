const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "I@ngrg112",
  database: "nobu",
});

module.exports = sequelize;
