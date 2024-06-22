const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const UserModel = require("../client/user");
const SupportChatRoomModel = require("./supportChatRoom");

const SupportChatModel = sequelize.define("support_chat", {
  support_chat_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

SupportChatModel.belongsTo(UserModel, {
  foreignKey: "sender_id",
  onDelete: "CASCADE",
});
SupportChatModel.belongsTo(SupportChatRoomModel, {
  foreignKey: "support_chat_room_id",
  onDelete: "CASCADE",
});
module.exports = SupportChatModel;
