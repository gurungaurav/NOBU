const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const RoomTypesModel = require("./room_types");
const RoomPicturesModel = require("./room_pictures");
const RoomBedsModel = require("./room_beds");
const HotelModel = require("./hotel");

const RoomModel = sequelize.define("rooms", {
  room_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  room_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price_per_night: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  amenities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  room_capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  floor: {
    type: DataTypes.ENUM(
      "First",
      "Second",
      "Third",
      "Fourth",
      "Fifth",
      "Sixth",
      "Seventh",
      "Eighth",
      "Ninth",
      "Tenth"
    ),
    defaultValue: "First",
    allowNull: false,
  },
});

RoomTypesModel.hasMany(RoomModel, { foreignKey: "room_type_id" });
RoomModel.hasMany(RoomPicturesModel, {
  foreignKey: "room_id",
  onDelete: "CASCADE",
});
// RoomModel.hasMany(RoomAmenitiesModel, {foreignKey:"room_id"})
RoomModel.hasMany(RoomBedsModel, { foreignKey: "room_id" });

module.exports = RoomModel;
