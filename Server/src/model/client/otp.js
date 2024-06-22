const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");

const OtpModel = sequelize.define("otp", {
  opt_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  otp_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// OTPModel.hasOne(

module.exports = OtpModel;
