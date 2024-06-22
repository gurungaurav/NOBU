const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const RoomModel = require("./room");
const RoomTypesModel = require("./room_types");
const HotelPicturesModel = require("./hotel_pictures");
const UserModel = require("../client/user");
const AmenitiesModel = require("./amenities");
const FAQModel = require("./faq");

const HotelModel = sequelize.define("hotel", {
  hotel_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  hotel_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  main_picture: {
    type: DataTypes.STRING,
    allowNull: false,
    // defaultValue: null,
  },
  phone_number: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  ratings: {
    type: DataTypes.ENUM("1", "2", "3", "4", "5"),
    allowNull: false,
    defaultValue: "1",
  },
  hotel_amenities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hotel_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// HotelModel.belongsTo(UserModel, { foreignKey: "vendor_id"});
HotelModel.hasMany(RoomModel, { foreignKey: "hotel_id", onDelete: "CASCADE" });
// HotelModel.hasMany(RoomTypesModel, {foreignKey:"hotel_id"})
// HotelModel.hasMany(HotelAmenitiesModel, {
//   foreignKey: "hotel_id",
//   onDelete: "CASCADE",
// });
HotelModel.hasMany(HotelPicturesModel, {
  foreignKey: "hotel_id",
  onDelete: "CASCADE",
});

HotelModel.hasMany(FAQModel, { foreignKey: "hotel_id", onDelete: "CASCADE" });
module.exports = HotelModel;
