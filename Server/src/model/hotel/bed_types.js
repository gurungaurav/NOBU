const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const RoomBedsModel = require("./room_beds");

const BedTypesModel = sequelize.define("bed_types", {
  bed_types_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  type_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

BedTypesModel.hasMany(RoomBedsModel, { foreignKey: "bed_type_id" });
module.exports = BedTypesModel;
