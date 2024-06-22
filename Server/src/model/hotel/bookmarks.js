const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const UserModel = require("../client/user");
const RoomModel = require("./room");

const BookMarkModel = sequelize.define("bookmarks", {
  bookmark_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
});

UserModel.hasMany(BookMarkModel, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
RoomModel.hasOne(BookMarkModel, { foreignKey: "room_id", onDelete: "CASCADE" });
module.exports = BookMarkModel;
