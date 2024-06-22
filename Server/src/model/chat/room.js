const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const UserModel = require("../client/user");
const HotelModel = require("../hotel/hotel");

//! For the chat one will be the vendor and other will be the user so i can take out the vendor id from hotel table and then perform the chat
const ChatRoomModel = sequelize.define("chat_room", {
  chat_room_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
});

UserModel.hasMany(ChatRoomModel, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
UserModel.hasMany(ChatRoomModel, {
  foreignKey: "vendor_id",
  onDelete: "CASCADE",
});
module.exports = ChatRoomModel;
