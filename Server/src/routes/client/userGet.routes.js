const express = require("express");
const roleAuth = require("../../middleware/auth/roleAuth");
const userMidd = require("../../middleware/client/user.midd");
const HotelModel = require("../../model/hotel/hotel");
const {
  userHotelController,
  userController,
} = require("../../controller/user-controllers");
const { getAllChats } = require("../../socket.io/messenger");
const sendMail = require("../../utils/mail/mailSender");
const generatePDF = require("../../utils/pdf/pdfGenerator");
const pdfSender = require("../../utils/mail/pdfSender");
const UserModel = require("../../model/client/user");
const NotificationModel = require("../../model/client/notifications");
const successHandler = require("../../utils/handler/successHandler");
const BookingModel = require("../../model/client/bookings");
const { Op } = require("sequelize");
const getUserRoutes = express.Router();

//? http://localhost:1000/api/nobu/user/getUser/allHotels
getUserRoutes.get("/allHotels", userHotelController.getAllHotels);

// //? http://localhost:1000/api/nobu/user/getUser/allRooms/:hotel_id
// getUserRoutes.get(
//   "/allRooms/:hotel_id",
//   userMidd.userHotelMidd.getAllHotelRoomsMidd,
// );

getUserRoutes.get(
  "/mailVerificationSend/:user_id",
  userController.generateVerifyTokenMail
);

//? http://localhost:1000/api/nobu/user/getUser/mainHotel/:hotel_id
getUserRoutes.get("/mainHotel/:hotel_id", userHotelController.getSpecificHotel);

//? http://localhost:1000/api/nobu/user/getUser/rooms/:hotel_id/:room_id
getUserRoutes.get(
  "/getSingleRoomById/:hotel_id/:room_id",
  userMidd.userHotelMidd.getHotelRoomMidd,
  userHotelController.getHotelRoom
);

getUserRoutes.get("/getAllBedTypes", userHotelController.getBedTypes);

getUserRoutes.get(
  "/getHotelReviews/:hotel_id",
  userHotelController.getHotelReviews
);

//!For hotel filtering
getUserRoutes.get("/searchHotelFilter", userHotelController.searchHotelFilter);

getUserRoutes.get(
  "/searchRoomFilter/:hotel_id",
  userHotelController.searchRoomFilter
);

getUserRoutes.get("/userDetails/:id", userController.userDetails);

getUserRoutes.get(
  "/userDetails/:user_id/usersBookingHistory",
  userHotelController.usersBookingHistory
);
getUserRoutes.get(
  "/checkListYourProperty/:user_id",
  roleAuth.UserAuthorizeRole(),
  userHotelController.checkListYourProperty
);

getUserRoutes.get("/chatRoom/:vendor_id/:user_id", getAllChats);

getUserRoutes.get(
  "/userDetails/:user_id/usersBookingDetails/:booking_id",
  userHotelController.usersSpecificBookingDetails
);

getUserRoutes.get(
  "/getAllAdditionalServices/:hotel_id",
  userHotelController.getAllAdditionalServices
);

getUserRoutes.get(
  "/getSpecificBookingDetailsUser/:booking_id",
  userHotelController.getSpecificBookingDetails
);

getUserRoutes.get(
  "/getAllHotelPictures/:hotel_id",
  userHotelController.getAllGalleryPictures
);

getUserRoutes.get(
  "/getAllAdditionalServicesFilter",
  userHotelController.getAllAdditionalServices
);

getUserRoutes.get("/getAllFAQ/:hotel_id", userHotelController.getAllFAQHotel);

getUserRoutes.get("/getNotifications/:receiver_id", async (req, res, next) => {
  try {
    const { receiver_id } = req.params;

    const page = req.query.page || 1;
    const user = await UserModel.findOne({ where: { user_id: receiver_id } });
    if (!user) {
      throw { status: 404, message: "No user found" };
    }

    // Fetch the notifications based on the page number
    const limit = 6; // Number of notifications to fetch per page
    const offset = (page - 1) * limit;
    // const notifications = await NotificationModel.findAll({
    //   where: { receiver_id: user.user_id },
    //   order: [["createdAt", "DESC"]],
    //   limit,
    //   offset,
    // });

    const notifications = await NotificationModel.findAll({
      where: { receiver_id: user.user_id },
    });

    const notificationDetails = await Promise.all(
      notifications.map(async (noti) => {
        const sender = await UserModel.findOne({
          where: { user_id: noti.sender_id },
        });
        return {
          notifications_id: noti.notifications_id,
          message: noti.message,
          receiver_id: user.user_id,
          type: noti.type,
          sender: {
            user_id: sender.user_id,
            user_name: sender.user_name,
            profile: sender.profile_picture,
          },
          createdAt: noti.createdAt,
        };
      })
    );

    successHandler(
      res,
      200,
      notificationDetails,
      "The latest notifications of the user!"
    );
  } catch (e) {
    next(e);
  }
});

getUserRoutes.get(
  "/checkNotifications/:receiver_id",
  async (req, res, next) => {
    try {
      const { receiver_id } = req.params;

      const user = await UserModel.findOne({ where: { user_id: receiver_id } });
      if (!user) {
        throw { status: 404, message: "No user found" };
      }

      const notiCounts = await NotificationModel.count({
        where: { receiver_id: user.user_id, status: "unread" },
      });

      if (notiCounts == 0) {
        return successHandler(res, 200, 0, "No notifications!");
      }

      return successHandler(res, 200, notiCounts, "Unread notifications");
    } catch (e) {
      next(e);
    }
  }
);

getUserRoutes.patch(
  "/readNotifications/:receiver_id",
  async (req, res, next) => {
    try {
      const { receiver_id } = req.params;

      const user = await UserModel.findOne({ where: { user_id: receiver_id } });
      if (!user) {
        throw { status: 404, message: "No user found" };
      }

      const unreadNoti = await NotificationModel.findAll({
        where: { receiver_id: user.user_id, status: "unread" },
      });

      const read = { status: "read" };
      for (let i of unreadNoti) {
        await NotificationModel.update(read, {
          where: { notification_id: i.notification_id },
        });
      }

      successHandler(res, 201, null, "All notifications have been read!");
    } catch (e) {
      next(e);
    }
  }
);

getUserRoutes.get("/checkHotel/:hotel_id", userHotelController.checkHotel);

getUserRoutes.post("/getPdf", async (req, res, next) => {
  const bookingDetails = {
    booking_id: 12134,
    room_id: "123ABC",
    customer_name: "John Doe",
    customer_email: "johndoe@example.com",
    customer_phone: "+1234567890",
    check_in: "2024-03-01",
    check_out: "2024-03-05",
    nights_days: 4,
    Hotel_name: "hhe",
    Location: undefined,
    num_people: 2,
    total_price: 500.0,
    payment_method: "Khalti",
  };
  const pdf = await generatePDF(bookingDetails);

  console.log(pdf, "hhshs");
  await pdfSender("gurungg113@gmail.com", "PDF generated", pdf);

  res.status(200).send("Success");
});

getUserRoutes.post("/checkHehe/:booking_id", async (req, res, next) => {
  try {
    const { booking_id } = req.params;
    const bookingDetails = await BookingModel.findOne({
      where: { booking_id: booking_id },
    });
    const checkPendingBookings = await BookingModel.findAll({
      where: {
        room_id: bookingDetails.room_id,
        check_in_date: { [Op.lte]: bookingDetails.check_in_date },
        check_out_date: { [Op.gte]: bookingDetails.check_out_date },
        status: "pending",
        booking_id: { [Op.not]: bookingDetails.booking_id },
      },
    });

    res.status(201).send(checkPendingBookings);
  } catch (e) {
    next(e);
  }
});
module.exports = getUserRoutes;

//! Like the main page will include on filtering the hotels according to its amenities, locations and availability and on the
//? The main page of the hotel the room will include the hotels specific rooms so two filtering parts okay
