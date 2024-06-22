const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const UserModel = require("../client/user");
const ChatRoomModel = require("./room");

//!There will be chat room and chat where chat room will include the room _id and the users that are connected during the conversation
//!For now i will use only two one the vendor and the user
//!Then in the chat the room_id will be included and then the user id will also be included because to know if the user id matches with the
//!User 1 or user 2 of the room if it matches with user 1 then the user 1 will be the sender and user 2 the receiver

const ChatModel = sequelize.define("chat", {
  chat_id: {
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

// UserModel.hasMany(ChatModel,{foreignKey:"user_id"})
// ChatModel.belongsTo(UserModel,{foreignKey:"receiver_id"})
ChatModel.belongsTo(UserModel, { foreignKey: "sender_id" });
ChatModel.belongsTo(ChatRoomModel, { foreignKey: "chat_room_id" });
module.exports = ChatModel;
