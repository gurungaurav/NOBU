const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");

const FAQModel = sequelize.define("faqs", {
  faq_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = FAQModel;
