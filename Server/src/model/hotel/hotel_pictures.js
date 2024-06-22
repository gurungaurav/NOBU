const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");

const HotelPicturesModel = sequelize.define("hotel_pictures", {
  hotel_picture_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  hotel_picture: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = HotelPicturesModel;
