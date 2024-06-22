const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const UserModel = require("./user");
const BookingModel = require("./bookings");

//!Yeta chai khalti bata aako response or transaction record rakhni
//!Khaskari payment mai rakhda hunthyo sab details but tyo khalti ko payment ko idx yesma haldeko chu so that i can do refund but maile garina so yetaikai chordinchu
const TransactionModel = sequelize.define("transactions", {
  transaction_id: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("refund", "success"),
    allowNull: false,
    defaultValue: "success",
  },
  commission: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
UserModel.hasMany(TransactionModel, { foreignKey: "user_id" });
UserModel.hasMany(TransactionModel, { foreignKey: "vendor_id" });
// BookingModel.hasMany(TransactionModel,{foreignKey:"booking_id"})

module.exports = TransactionModel;
