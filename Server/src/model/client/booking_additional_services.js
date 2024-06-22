const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const Hotel_Additional_Services = require("../hotel/hotel_additional_services");
const BookingModel = require("./bookings");

const Bookings_Additional_Services = sequelize.define(
  "bookings_additional_services",
  {
    bookings_additional_services_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
  }
);

BookingModel.hasMany(Bookings_Additional_Services, {
  foreignKey: "booking_id",
  onDelete: "CASCADE",
});
Hotel_Additional_Services.hasMany(Bookings_Additional_Services, {
  foreignKey: "additional_services_id",
  onDelete: "CASCADE",
});

module.exports = Bookings_Additional_Services;
