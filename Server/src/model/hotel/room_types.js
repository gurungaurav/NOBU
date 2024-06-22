const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");

//!Then the bed types and room id will be used in a table as a composite fks so that the room will have multiple beds at a single time
//? Then according to the room beds the capacity will be kept in the room table in the column room_capacity okay
const RoomTypesModel = sequelize.define("room_types", {
  room_type_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  type_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = RoomTypesModel;
