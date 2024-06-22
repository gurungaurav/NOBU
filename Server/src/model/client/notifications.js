const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const UserModel = require("./user");

const NotificationModel = sequelize.define("notifications", {
  notification_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("read", "unread"),
    defaultValue: "unread",
  },
  type: {
    type: DataTypes.ENUM(
      "check-in-reminder",
      "check-out-reminder",
      "complete",
      "booked",
      "refund",
      "pending",
      "canceled",
      "message",
      "support",
      "hotel_accepted",
      "hotel_rejected",
      "verified",
      "notVerified"
    ),
  },
});

UserModel.hasMany(NotificationModel, {
  foreignKey: "sender_id",
  onDelete: "CASCADE",
});
UserModel.hasMany(NotificationModel, {
  foreignKey: "receiver_id",
  onDelete: "CASCADE",
});

module.exports = NotificationModel;
