const express = require("express");
const { adminMidd } = require("../../middleware/admin/admin.midd");
const adminController = require("../../controller/admin-controllers");
const adminValidator = require("../../validator/admin/admin.validator");
const roleAuth = require("../../middleware/auth/roleAuth");
const {
  addAmenitiesValidSchema,
  addRoomTypesValidSchema,
  addBedTypesValidSchema,
  addAmenitiesSingleSchema,
} = require("../../validator/schema/admin.schema");

const adminRoutes = express.Router();

//? http://localhost:1000/api/nobu/admin/allVerificationVendors
adminRoutes.get(
  "/allVerificationVendors",
  // roleAuth.AdminAuthorizeRole(),
  // adminMidd.allVendorsVerifyCheck,
  adminController.getAllVendorsVerify
);

//? http://localhost:1000/api/nobu/admin/verifyHotel/:hotel_id
adminRoutes.post(
  "/verifyHotel/:hotel_id/:admin_id",
  // roleAuth.AdminAuthorizeRole(),
  adminMidd.verifyVendorsMidd,
  adminController.verifyVendor
);

adminRoutes.post(
  "/rejectHotel/:hotel_id/:admin_id",
  // roleAuth.AdminAuthorizeRole(),
  adminMidd.rejectVendorsMidd,
  adminController.rejectVendor
);

adminRoutes.post(
  "/addAmenities",
  roleAuth.AdminAuthorizeRole(),
  adminValidator.addAmenitiesValidator(addAmenitiesValidSchema),
  adminMidd.verifyAmenities,
  adminController.addAmenities
);

adminRoutes.post(
  "/addRoomTypes",
  roleAuth.AdminAuthorizeRole(),
  adminValidator.addRoomTypesValidator(addRoomTypesValidSchema),
  adminMidd.verifyRoomTypes,
  adminController.addRoomTypes
);

adminRoutes.post(
  "/addBedTypes",
  roleAuth.AdminAuthorizeRole(),
  adminValidator.addBedTypesValidator(addBedTypesValidSchema),
  adminMidd.verifyBedTypes,
  adminController.addBedTypes
);

adminRoutes.get(
  "/getSpecificVerifyHotels/:hotel_id",
  adminController.getSpecificHotelVerify
);

adminRoutes.get(
  "/getSpecificVerifiedHotels/:hotel_id",
  adminController.getSpecificHotelVerified
);

adminRoutes.patch(
  "/updateAmenities/:amenity_id",
  roleAuth.AdminAuthorizeRole(),
  adminController.updateSpecificAmenities
);

adminRoutes.patch(
  "/updateVerificationStatusHotel/:hotel_id",
  roleAuth.AdminAuthorizeRole(),
  adminController.updateSepcificHotelVerification
);

adminRoutes.get("/getAllVerifiedHotels", adminController.getAllHotels);

adminRoutes.get("/getAllAmenitiesAdmin", adminController.getAllAmenitiesLists);

adminRoutes.post(
  "/addAmenitiesSingle",
  roleAuth.AdminAuthorizeRole(),
  adminValidator.addAmenitiesValidator(addAmenitiesSingleSchema),
  // adminMidd.verifyAmenities,
  adminController.addSingleAmenities
);

adminRoutes.get("/allBedTypes", adminController.getAllBedTypes);

adminRoutes.patch(
  "/updateBedType/:bed_type_id",
  adminController.updateSpecificBedType
);

adminRoutes.delete(
  "/deleteAmenities/:amenity_id",
  adminController.amenityDelete
);

adminRoutes.get("/getAllUsers", adminController.getAllUsers);

adminRoutes.get("/getAllBlogs", adminController.adminGetAllBlogs);

adminRoutes.post(
  "/deleteBlogs/:blog_id/:admin_id",
  adminController.deleteBlogsAdmin
);

adminRoutes.post("/deleteUser/:user_id", adminController.deleteUserByAdmin);

adminRoutes.get(
  "/getAllTransactions/:admin_id",
  adminController.getAllPaymentDetails
);

adminRoutes.get(
  "/getAllAdminDashboardDetails/:admin_id",
  adminController.adminDashboardDetails
);
module.exports = adminRoutes;
