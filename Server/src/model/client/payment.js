const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const UserModel = require("./user");
const RoomModel = require("../hotel/room");
const BookingModel = require("./bookings");
const TransactionModel = require("./transactions");

const PaymentModel = sequelize.define("payments", {
  payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM("refund", "success"),
    allowNull: false,
    defaultValue: "success",
  },
  method: {
    type: DataTypes.ENUM("Khalti", "Esewa"),
    allowNull: false,
    defaultValue: "Khalti",
  },
});

BookingModel.hasOne(PaymentModel, {
  foreignKey: "booking_id",
  onDelete: "CASCADE",
});
TransactionModel.hasOne(PaymentModel, {
  foreignKey: "transaction_id",
  onDelete: "CASCADE",
});
module.exports = PaymentModel;
