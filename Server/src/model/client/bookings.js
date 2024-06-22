const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const UserModel = require("./user");
const RoomModel = require("../hotel/room");

//!So the enum of the status defines success after successful room bookings like once the user has stayed on the hotel
//! Then the canceled means canceling the booking only like once they have reserved then if they dont want to proceed towards the payment then they can cancel the booking
//! Then the refund is basically refund after payment and then booked is basically ready for customer to arrive heheh
const BookingModel = sequelize.define("bookings", {
  booking_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  check_in_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  check_out_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      "pending",
      "success",
      "canceled",
      "booked",
      "refund",
      "ongoing"
    ),
    defaultValue: "pending",
  },
});

UserModel.hasMany(BookingModel, { foreignKey: "user_id", onDelete: "CASCADE" });
RoomModel.hasMany(BookingModel, { foreignKey: "room_id", onDelete: "CASCADE" });
BookingModel.belongsTo(RoomModel, {
  foreignKey: "room_id",
});

module.exports = BookingModel;
