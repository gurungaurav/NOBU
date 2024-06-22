const BlogTagsModel = require("../../model/blogs/blog_tags");
const BlogCategoryModel = require("../../model/blogs/blog_tags");
const UserModel = require("../../model/client/user");
const AmenitiesModel = require("../../model/hotel/amenities");
const BedTypesModel = require("../../model/hotel/bed_types");
const HotelModel = require("../../model/hotel/hotel");
const RoomTypesModel = require("../../model/hotel/room_types");
const successHandler = require("../../utils/handler/successHandler");
const Filter = require("bad-words");
const filter = new Filter();

//!This is for admin adding categories for blogs
class BlogAdminMidd {
  //?http://localhost:1000/api/nobu/blog/blogCategories
  blogCategoriesMidd = async (req, res, next) => {
    try {
      const { name, description } = req.body;

      if (!name || !description) {
        throw { status: 400, message: "Fill up the forms please!" };
      }

      const isNameClear = filter.isProfane(name);

      if (isNameClear) {
        throw { status: 400, message: "Please use appropriate name!" };
      }

      const isDescriptionClear = filter.isProfane(description);

      if (isDescriptionClear) {
        throw { status: 400, message: "Please use appropriate description!" };
      }

      const blogCat = await BlogTagsModel.findOne({
        where: { tag_name: name },
      });

      if (blogCat) {
        throw { status: 400, message: "Can't post same category again!" };
      }

      req.blogCat = { name, description };
      next();
    } catch (e) {
      next(e);
    }
  };
}

class AdminMidd {
  //!Not needed
  allVendorsVerifyCheck = async (req, res, next) => {
    try {
      const users = await UserModel.findAll();

      // const vendors = users.filter(
      //   (users) => users.vendor_verified === "pending"
      // );

      req.vendors = { vendors };
      next();
    } catch (e) {
      next(e);
    }
  };

  //? http://localhost:1000/api/nobu/admin/verifyHotel/:hotel_id
  verifyVendorsMidd = async (req, res, next) => {
    try {
      const hotel_id = req.params.hotel_id;

      const hotel = await HotelModel.findOne({ where: { hotel_id: hotel_id } });

      if (!hotel) {
        throw { status: 404, message: "No hotel found" };
      }

      if (hotel.hotel_verified) {
        throw {
          status: 400,
          message: "Admin already responded to this hotel!",
        };
      }

      const vendor = await UserModel.findOne({
        where: { user_id: hotel.vendor_id },
      });

      if (!vendor) {
        throw { status: 404, message: "User hasn't been registerd!" };
      }

      // if (
      //   vendor.vendor_verified === "verified" ||
      //   vendor.vendor_verified === "rejected"
      // ) {
      //   throw {
      //     status: 400,
      //     message: "Admin already responded to this vendor!",
      //   };
      // }

      req.hotel = { hotel, vendor };

      next();
    } catch (e) {
      next(e);
    }
  };

  //? http://localhost:1000/api/nobu/admin/rejectVendor/:hotel_id
  rejectVendorsMidd = async (req, res, next) => {
    try {
      const hotel_id = req.params.hotel_id;

      const hotel = await HotelModel.findOne({ where: { hotel_id: hotel_id } });

      if (!hotel) {
        throw { status: 404, message: "No hotel found" };
      }

      if (hotel.hotel_verified) {
        throw {
          status: 400,
          message: "Admin already responded to this hotel!",
        };
      }

      const vendor = await UserModel.findOne({
        where: { user_id: hotel.vendor_id },
      });

      if (!vendor) {
        throw { status: 404, message: "User hasn't been registerd!" };
      }

      // if (
      //   vendor.vendor_verified === "verified" ||
      //   vendor.vendor_verified === "rejected"
      // ) {
      //   throw {
      //     status: 400,
      //     message: "Admin already responded to this vendor!",
      //   };
      // }

      req.hotel = { hotel, vendor };

      next();
    } catch (e) {
      next(e);
    }
  };

  verifyAmenities = async (req, res, next) => {
    try {
      const { amenities } = req.body;

      const checkAmenities = await Promise.all(
        amenities.map(async (amen) => {
          const checkAmenity = await AmenitiesModel.findOne({
            where: { amenity_name: amen.amenity_name },
          });
          return checkAmenity;
        })
      );

      const existingAmenities = checkAmenities.filter(
        (amenity) => amenity !== null
      );

      if (existingAmenities.length > 0) {
        throw { status: 409, message: "Some amenities are already added" };
      }

      req.amenities = { amenities };
      next();
    } catch (e) {
      next(e);
    }
  };

  verifyRoomTypes = async (req, res, next) => {
    try {
      const { room_Type } = req.body;
      // const user_id = req.params.user_id;

      // const user = await UserModel.findOne({ where: { user_id: user_id } });

      // if (!user) {
      //   throw { status: 404, message: "User hasn't been registered yet!!" };
      // }

      // if (user.role != "vendor") {
      //   throw { status: 401, mesage: "Un authorized role!!" };
      // }

      const roomType = await RoomTypesModel.findOne({
        where: { type_name: room_Type },
      });

      if (roomType) {
        throw { status: 409, message: "The room type has been already taken!" };
      }

      req.roomType = { room_Type };
      next();
    } catch (e) {
      next(e);
    }
  };

  verifyBedTypes = async (req, res, next) => {
    try {
      const { bed_type, capacity } = req.body;

      const bedType = await BedTypesModel.findOne({
        where: { type_name: bed_type },
      });

      if (bedType) {
        throw { status: 409, message: "The bed type has been already taken!" };
      }

      req.bed = { bed_type, capacity };
      next();
    } catch (e) {
      next(e);
    }
  };
}

module.exports.blogAdminMidd = new BlogAdminMidd();
module.exports.adminMidd = new AdminMidd();
