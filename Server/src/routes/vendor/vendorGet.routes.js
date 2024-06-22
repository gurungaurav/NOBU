const express = require("express");
const vendorController = require("../../controller/vendor-controllers");
const roleAuth = require("../../middleware/auth/roleAuth");
const vendorMidd = require("../../middleware/vendor/vendor.midd");
const { userHotelController } = require("../../controller/user-controllers");
const getVendor = express.Router();

//?http://localhost:1000/api/nobu/vendor/getVendors/getAllRoomTypes
getVendor.get("/getAllRoomTypes", vendorController.getAllRoomTypesRegis);

//?http://localhost:1000/api/nobu/vendor/getVendors/getAllAmenitiesRegi
getVendor.get("/getAllAmenitiesRegi", vendorController.getAllAmenitiesRegi);

//?http://localhost:1000/api/nobu/vendor/getVendors/getHotelAmenities/:vendor_id
getVendor.get(
  "/getHotelAmenities/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.getHotelAmenRegist
);

//?http://localhost:1000/api/nobu/vendor/getVendors/getRoomTypes
getVendor.get("/getRoomTypes", vendorController.getRoomTypes);

//?http://localhost:1000/api/nobu/vendor/getVendors/getAllRooms/:vendor_id
getVendor.get("/getAllRooms/:vendor_id", vendorController.getAllHotelsRooms);

//? http://localhost:1000/api/nobu/vendor/getVendors/allRooms/:hotel_name
getVendor.get(
  "/allRooms/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.getAllRooms
);

getVendor.get(
  "/getSpecificHotel/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.getSpecificHotelDetails
);

//! registering the hotel
getVendor.get("/getBedTypes", vendorController.getAllBedTypes);

getVendor.get("/getHotel/:vendor_id", vendorController.getSingleHotel);

getVendor.get("/getChats/:vendor_id", vendorController.getAllChats);

getVendor.get(
  "/getVendorDashBoardDetails/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.getVendorDashboardDetails
);

//? http://localhost:1000/api/nobu/user/getVendor/getSingleRoomByName/:hotel_id/:room_id
getVendor.get(
  "/getSingleRoomByName/:hotel_name/:room_id",
  roleAuth.VendorAuthorizeRole(),
  vendorMidd.getRoomMidd,
  vendorController.getHotelRoom
);

getVendor.get(
  "/getBookingDetailsAll/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.getAllBookingDetails
);

getVendor.get(
  "/getGuestsDetails/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.guestDetails
);

getVendor.get(
  "/getGuestsDetails/:hotel_name/specificDetails/:user_id",
  roleAuth.VendorAuthorizeRole(),
  vendorController.specificUserDetails
);

getVendor.get(
  "/getPaymentDetailsAll/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.getAllPaymentDetails
);

// getVendor.get(
//   "/guestsFilter/:hotel_name",
//   roleAuth.VendorAuthorizeRole(),
//   vendorController
// );

getVendor.get(
  "/checkVendor/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  async (req, res, next) => {
    res.status(200).send("Success");
  }
);

getVendor.get(
  "/getBookingDetailsAll/:hotel_name/getSpecificDetails/:booking_id",
  roleAuth.VendorAuthorizeRole(),
  vendorController.getSpecificBookingDetails
);

getVendor.get(
  "/allReviewsHotel/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.getAllReviewsHotel
);

getVendor.get(
  "/allAdditionalServices/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.getAllAdditionalServices
);

getVendor.get(
  "/getAllAmenitiesHotel/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.getAllAmenitiesHotel
);

getVendor.get(
  "/getAllFAQVendor/:hotel_name",
  roleAuth.VendorAuthorizeRole(),
  vendorController.getAllFAQHotel
);

module.exports = getVendor;
