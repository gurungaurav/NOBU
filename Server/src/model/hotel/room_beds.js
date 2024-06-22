const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");

const RoomBedsModel = sequelize.define("room_beds", {
  room_bed_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
});

module.exports = RoomBedsModel;
