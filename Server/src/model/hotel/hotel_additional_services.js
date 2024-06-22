const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const HotelModel = require("./hotel");

const Hotel_Additional_Services = sequelize.define("additional_services", {
  additional_services_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  service_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

HotelModel.hasMany(Hotel_Additional_Services, {
  foreignKey: "hotel_id",
  onDelete: "CASCADE",
});

module.exports = Hotel_Additional_Services;
