const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const UserModel = require("../client/user");

//! For the chat one will be the vendor and other will be the user so i can take out the vendor id from hotel table and then perform the chat
const SupportChatRoomModel = sequelize.define("support_chat_room", {
  support_chat_room_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("finished", "pending"),
    defaultValue: "pending",
    allowNull: false,
  },
});

UserModel.hasMany(SupportChatRoomModel, {
  foreignKey: "vendor_id",
  onDelete: "CASCADE",
});
UserModel.hasMany(SupportChatRoomModel, {
  foreignKey: "admin_id",
  onDelete: "CASCADE",
});
module.exports = SupportChatRoomModel;
