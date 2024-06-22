const express = require("express");
const uploadCloudImage = require("../../middleware/upload/uploadCloudImage");
const {
  mailVerification,
  emailVerification,
  checkContactUsMidd,
} = require("../../middleware/mail/mailVerification");
const jwtVerificationMidd = require("../../middleware/jwt/jwtVerification");
const {
  userLoginValidSchema,
  userRegisterValidSchema,
  resetPasswordValidSchema,
  userBookmarksValidSchema,
  userHotelReviewValidSchema,
} = require("../../validator/schema/user.schema");
const userValidator = require("../../validator/client/user.validator");
const multer = require("multer");
const getUserRoutes = require("./userGet.routes");
const {
  userController,
  userHotelController,
} = require("../../controller/user-controllers");
const {
  userMidd,
  userHotelMidd,
} = require("../../middleware/client/user.midd");
const userRoutes = express.Router({ mergeParams: true });
const upload = multer();
//!User pfp folder cloud
const userImageFolder = "userProfile";

//!Update user and hotels
//!User registration part
//!Should use multer to receive multipart form datas
//? http://localhost:1000/api/nobu/user/registerUser
userRoutes.post(
  "/registerUser",
  uploadCloudImage.uploadUserProfile(userImageFolder),
  userValidator.validateUserRegister(userRegisterValidSchema),
  userMidd.userRegistrationMidd,
  userController.addUser
);

//!User verification through email part
//? http://localhost:1000/api/nobu/user/:id/verify/:token
userRoutes.get(
  "/:id/verify/:token",
  mailVerification,
  userController.mailVerifiedController
);

//!User login part
//? http://localhost:1000/api/nobu/user/loginUser
userRoutes.post(
  "/loginUser",
  userValidator.validatedUserLogin(userLoginValidSchema),
  userMidd.loginUserMidd,
  userController.loginUser
);
//? http://localhost:1000/api/nobu/user/loginUser/jwtVerify
userRoutes.get(
  "/loginUser/jwtVerify",
  jwtVerificationMidd,
  userController.loggedUser
);

//!User email verify and otp gen for reseting password
//? http://localhost:1000/api/nobu/user/email/getOTP
userRoutes.post("/email/getOTP", emailVerification);

//!Password reset OTP verification
userRoutes.post("/verifyOTP/:user_id", userMidd.verifyOTPassword);

//!User password reset
//? http://localhost:1000/api/nobu/user/userPasswordChange
userRoutes.post(
  "/userPasswordChange",
  userValidator.validateUserResetPass(resetPasswordValidSchema),
  userMidd.resetPasswordUserMidd,
  userController.resetUserPassword
);

//? http://localhost:1000/api/nobu/user/updateUser/:user_id
userRoutes.patch(
  "/updateUser/:user_id",
  // roleAuth.UserAuthorizeRole(),
  uploadCloudImage.uploadUserProfile(userImageFolder),
  userMidd.updateUserMidd,
  userController.updateUser
);

//!This is for updation of the user's password through current password through profile
userRoutes.patch(
  "/updateUserPassword/:user_id",
  userMidd.updatePasswordUserMidd,
  userController.updatePasswordProfile
);

//!For user interacting with Hotel

//? http://localhost:1000/api/nobu/user/bookmark/:room_id/:hotel_id/:user_id
userRoutes.post(
  "/bookmark/:room_id/:hotel_id/:user_id",
  // roleAuth.UserAuthorizeRole(),
  userValidator.validateBookmarks(userBookmarksValidSchema),
  userHotelMidd.bookMarkMidd,
  userHotelController.bookMarkRoom
);

//? http://localhost:1000/api/nobu/user/addRoomReview/:user_id/:hotel_id
userRoutes.post(
  "/addHotelReview/:user_id/:hotel_id",
  // roleAuth.UserAuthorizeRole(),
  userValidator.validateHotelReview(userHotelReviewValidSchema),
  userHotelMidd.hotelReviewMidd,
  userHotelController.hotelReview
);

//!For User get routes
userRoutes.use("/getUser", getUserRoutes);

userRoutes.post(
  "/bookRooms/:room_id/:user_id",
  // roleAuth.UserAuthorizeRole(),
  userHotelMidd.checkBookRooms,
  userHotelController.bookRooms
);

userRoutes.post(
  "/bookRoom/paymentConfirmation/:booking_id/:hotel_id",
  userHotelController.confirmPayment
);

userRoutes.post(
  "/bookRoom/paymentConfirmationEsewa/:booking_id/:hotel_id",
  userHotelController.confirmPaymentEsewa
);

// userRoutes.patch(
//   "/upload-profile",
//   uploadFile("profile_picture", userImageFolder),
//   (req, res, next) => {
//     const uriFromCloudinary = req.profile_picture;
//     console.log("from controller", uriFromCloudinary);

//     res.send("ok");

//     // console.log(req.file);
//     // console.log(req.files);
//   }
// );

userRoutes.post(
  "/contactUs/sendMail/:hotel_id",
  checkContactUsMidd,
  userHotelController.contactUsMail
);

userRoutes.delete(
  "/deleteHotelReviewsByUser/:review_id/:user_id",
  userHotelController.deleteReviewUser
);

userRoutes.delete(
  "/removeBookmarksByUser/:bookmark_id/:user_id",
  userHotelController.removeBookMarkByUser
);

userRoutes.delete(
  "/deleteBlogsUserProfile/:blog_id/:user_id",
  userHotelController.deleteBlogsUserProfile
);

userRoutes.patch("/refundRoom/:booking_id", userHotelController.refundMain);

//!For canceling the booking while it is on pending
userRoutes.patch(
  "/cancelBookingsPending/:booking_id",
  userHotelController.cancelBookingsPending
);

userRoutes.post(
  "/sendMailAdminListProperty",
  userHotelController.sendMailListProperty
);
module.exports = userRoutes;
