const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const HotelModel = require("./hotel");
const UserModel = require("../client/user");

const HotelReviewModel = sequelize.define("hotel_reviews", {
  hotel_review_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  ratings: {
    type: DataTypes.ENUM("1", "2", "3", "4", "5"),
    allowNull: false,
    defaultValue: "1",
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

HotelModel.hasMany(HotelReviewModel, {
  foreignKey: "hotel_id",
  onDelete: "CASCADE",
});
UserModel.hasMany(HotelReviewModel, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

module.exports = HotelReviewModel;
