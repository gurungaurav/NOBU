const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");

const AmenitiesModel = sequelize.define("amenities", {
  amenities_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  amenity_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = AmenitiesModel;
