// Import necessary modules
const cron = require("node-cron");
const BookingModel = require("../model/client/bookings");
const RoomModel = require("../model/hotel/room");
const NotificationModel = require("../model/client/notifications");
const UserModel = require("../model/client/user");
const HotelModel = require("../model/hotel/hotel");
const { Op } = require("sequelize");

cron.schedule("* * * * * *", async () => {
  try {
    const today = new Date();
    const todayISOString = today.toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
    const bookingDates = await BookingModel.findAll();

    const recentDates = bookingDates.map((booking) => {
      // Convert the database date string to a Date object
      const date = new Date(booking.check_out_date); // Create a new Date object

      date.setDate(date.getDate() + 1);
      return date.toISOString().slice(0, 10);
    });

    const checkOutToday = recentDates.filter(
      (date) => date === todayISOString
    ).length;

    console.log(recentDates);
    console.log(todayISOString);
    console.log(checkOutToday);
    // Find bookings with check-out date equal to the current date
    const bookings = await BookingModel.findAll({
      where: { check_out_date: todayISOString, status: "ongoing" },
    });

    for (const booking of bookings) {
      const room = await RoomModel.findOne({
        where: { room_id: booking.room_id },
      });

      console.log(room);
      const user = await UserModel.findOne({
        where: { user_id: booking.user_id },
      });

      const hotel = await HotelModel.findOne({
        where: { hotel_id: room.hotel_id },
      });

      if (room) {
        console.log("hdh");
        // Update room status to available
        await room.update({ is_available: true });
        const status = { status: "success" };
        await BookingModel.update(status, {
          where: { booking_id: booking.booking_id },
        });
        //!Sending norification to the user
        const notificationUser = await NotificationModel.create({
          sender_id: hotel.vendor_id,
          receiver_id: user.user_id,
          type: "complete",
          message: "The booking has been successfully compeleted!",
        });
        //!Sending norification to the vendor
        const notificationVendor = await NotificationModel.create({
          sender_id: user.user_id,
          receiver_id: hotel.vendor_id,
          type: "complete",
          message: "The booking has been successfully compeleted!",
        });

        console.log(`Room ${room.room_id} status updated successfully.`);
      } else {
        console.log(`Room not found for booking ${booking.booking_id}.`);
      }
    }

    //!For updating the room if the user does not do the payment

    const pendingBookings = await BookingModel.findAll({
      where: { check_in_date: todayISOString, status: "pending" },
    });
    for (const booking of pendingBookings) {
      const room = await RoomModel.findOne({
        where: { room_id: booking.room_id },
      });

      console.log(room);
      const user = await UserModel.findOne({
        where: { user_id: booking.user_id },
      });

      const hotel = await HotelModel.findOne({
        where: { hotel_id: room.hotel_id },
      });

      if (room) {
        const status = { status: "canceled" };
        await BookingModel.update(status, {
          where: { booking_id: booking.booking_id },
        });
        //!Sending norification to the user about canceling the booking cuz if the user dosent pay the booking payament then
        await NotificationModel.create({
          sender_id: hotel.vendor_id,
          receiver_id: user.user_id,
          type: "canceled",
          message: "You did not done the payment then it has been canceled!",
        });

        console.log(`Room ${room.room_id} status updated successfully.`);
      } else {
        console.log(`Room not found for booking ${booking.booking_id}.`);
      }
    }

    //! For sending notification for check in tomorow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISOString = tomorrow.toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

    const tomorrowBookings = await BookingModel.findAll({
      where: {
        check_in_date: tomorrowISOString,
        status: { [Op.or]: ["booked", "pending"] },
      },
    });

    for (const booking of tomorrowBookings) {
      const room = await RoomModel.findOne({
        where: { room_id: booking.room_id },
      });
      const user = await UserModel.findOne({
        where: { user_id: booking.user_id },
      });
      const hotel = await HotelModel.findOne({
        where: { hotel_id: room.hotel_id },
      });

      if (booking.status == "pending") {
        //!Sending norification to the user on pending status
        await NotificationModel.create({
          sender_id: hotel.vendor_id,
          receiver_id: user.user_id,
          type: "pending",
          message:
            "You have one day left to confirm the booking other wise it will be canceled tomorrow!",
        });
      } else if (booking.status == "booked") {
        //!Sending norification to the user on tomorrow check in
        await NotificationModel.create({
          sender_id: hotel.vendor_id,
          receiver_id: user.user_id,
          type: "check-in-reminder",
          message: "Tomorrow is your check in date please be on time!",
        });
      }
    }
  } catch (error) {
    console.error("Error updating room statuses:", error);
  }
});

module.exports = cron;
