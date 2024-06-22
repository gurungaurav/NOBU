const express = require("express");
const uploadCloudImage = require("../../middleware/upload/uploadCloudImage");
const roleAuth = require("../../middleware/auth/roleAuth");
const {
  roomRegistrationValidSchema,
  vendorRegisterValidSchema,
} = require("../../validator/schema/vendor.schema");
const vendorValidator = require("../../validator/vendor/vendor.validatior");
const vendorMidd = require("../../middleware/vendor/vendor.midd");
const vendorController = require("../../controller/vendor-controllers");
const getVendor = require("./vendorGet.routes");

const vendorRoutes = express.Router();
const roomPictures = "room_pictures";
const hotelPictures = "hotel_pictures";

//!So while applying for the hotel the form will also include the and room amenities also

//!So the amenity check and types check should be done !!!!
//? http://localhost:1000/api/nobu/vendor/addVendors/:user_id
vendorRoutes.post(
  "/addVendors/:user_id",
  uploadCloudImage.uploadHotelImage(hotelPictures),
  // roleAuth.UserAuthorizeRole(),
  vendorValidator.validateVendorRegistration(vendorRegisterValidSchema),
  vendorMidd.vendorRegistrationMidd,
  vendorController.vendorRegistration
);

//? http://localhost:1000/api/nobu/vendor/addRooms/:vendor_id
vendorRoutes.post(
  "/addRooms/:vendor_id",
  uploadCloudImage.uploadRoomImage(roomPictures),
  // roleAuth.VendorAuthorizeRole(),
  vendorValidator.validateHotelRoomRegistration(roomRegistrationValidSchema),
  vendorMidd.hotelRoomRegistrationMidd,
  vendorController.hotelRoomRegistration
);

vendorRoutes.get(
  "/getRoomDetails/:room_id/:hotel_id",
  vendorController.getHotelRoomDetails
);

//?http://localhost:1000/api/nobu/vendor/deleteRooms/:room_id/:hotel_id
vendorRoutes.delete(
  "/deleteRooms/:room_id/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorMidd.deleteRoomsMidd,
  vendorController.deleteRoom
);

vendorRoutes.patch(
  //!Need to add photos on it
  "/updateRooms/:room_id/:hotel_name",
  uploadCloudImage.uploadRoomImage(roomPictures),
  roleAuth.VendorAuthorizeRole(),
  vendorMidd.updateRoomsMidd,
  vendorController.updateRoom
);

//!This is for updating specific details such as names, locations apart from the pictures
vendorRoutes.patch(
  "/updateHotelSpecificDetails/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.updateHotelsSpecificDetails
);

vendorRoutes.patch(
  "/updateHotelPictures/:hotel_name",
  uploadCloudImage.uploadHotelImage(hotelPictures),
  roleAuth.VendorAuthorizeRole(),
  vendorController.updateHotelsPicturesDetails
);

vendorRoutes.delete(
  "/deleteReviewsVendor/:hotel_name/:review_id",
  roleAuth.VendorAuthorizeRole(),
  vendorController.deleteReviewVendor
);

vendorRoutes.post(
  "/addAdditionalServices/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.addHotelAdditionalServices
);

vendorRoutes.delete(
  "/deleteAdditionalServices/:hotel_name/:service_id",
  roleAuth.VendorAuthorizeRole(),
  vendorController.deleteAdditionalServices
);

vendorRoutes.patch(
  "/updateServiceHotel/:hotel_name/:service_id",
  roleAuth.VendorAuthorizeRole(),
  vendorController.updateServiceHotel
);

vendorRoutes.patch(
  "/updateBookingDetails/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.updateBookingDetails
);

vendorRoutes.post(
  "/addAmenitiesHotel/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.addAmenitiesHotel
);

vendorRoutes.delete(
  "/deleteAmenitiesHotel/:hotel_name/:amenity",
  roleAuth.VendorAuthorizeRole(),
  vendorController.deleteAmenityHotel
);

vendorRoutes.patch(
  "/updateAmenitiesHotel/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.updateAmenityHotel
);

vendorRoutes.post(
  "/addFAQVendor/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.addFAQVendor
);

vendorRoutes.patch(
  "/updateFAQVendor/:hotel_name/:faq_id",
  roleAuth.VendorAuthorizeRole(),
  vendorController.updateFAQVendor
);

vendorRoutes.delete(
  "/deleteFAQVendor/:hotel_name/:faq_id",
  roleAuth.VendorAuthorizeRole(),
  vendorController.deleteFAQVendor
);
vendorRoutes.use("/getVendors", getVendor);

module.exports = vendorRoutes;
