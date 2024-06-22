const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");

const RoomPicturesModel = sequelize.define("room_pictures", {
  room_picture_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  room_picture: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = RoomPicturesModel;
