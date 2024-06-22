const UserModel = require("../../model/client/user");
const HotelModel = require("../../model/hotel/hotel");
const jwtVerificationMidd = require("../jwt/jwtVerification");

class RoleAuth {
  userAuth = async (req, res, next) => {
    try {
      if (req.user.role === "user") {
        if (req.user.verification) {
          console.log("pass");
          // req.user = user
          next();
        } else {
          throw { status: 403, message: "Verify your account first!" };
        }
      } else {
        throw { status: 401, message: "You have no authorization!!" };
      }
    } catch (e) {
      next(e);
    }
  };

  adminAuth = async (req, res, next) => {
    try {
      if (req.user.role === "admin") {
        if (req.user.verification) {
          console.log("pass");
          // req.user = user
          next();
        } else {
          throw { status: 403, message: "Verify your account first!" };
        }
      } else {
        throw { status: 401, message: "You have no authorization!!" };
      }
    } catch (e) {
      next(e);
    }
  };

  vendorAuth = async (req, res, next) => {
    try {
      if (req.user.role === "vendor") {
        if (req.user.verification) {
          console.log("pass");
          // req.user = user
          next();
        } else {
          throw { status: 403, message: "Verify your account first!" };
        }
      } else {
        throw { status: 401, message: "You have no authorization!!" };
      }
    } catch (e) {
      next(e);
    }
  };

  //!This is for verifying the vendor if the vendor is trying to access its dashboard or not
  vendorVerify = async (req, res, next) => {
    try {
      const { id } = req.user;
      const { hotel_name } = req.params;
      console.log(hotel_name, "hahahah");

      const name = hotel_name.replace(/_/g, " ");
      //!So what is done is the jwt detailed vendor's hotel and the url received hotel is checked if they got both the similar hotel or not
      //! This is done so that if the another user tries to access on the hotel then the error will be thrown cuz the real vendor of the hotel can
      //! Only access on the required dashboard so the jwt has the users credientials so by that the required hotel is searched and check if the params hotel matched with the reuqired vendor or not
      const vendor = await UserModel.findOne({ where: { user_id: id } });

      const vendorHotel = await HotelModel.findOne({
        where: { vendor_id: vendor.user_id },
      });

      if (!vendorHotel) {
        throw { status: 404, message: "No hotel's found!" };
      }

      if (!vendorHotel.hotel_verified) {
        throw {
          status: 403,
          message:
            "Your hotel has been un verified due to some suspicious acts!",
        };
      }

      const hotel = await HotelModel.findOne({
        where: { hotel_name: name },
      });

      if (!hotel) {
        throw {
          status: 404,
          message: "No hotel's found!",
        };
      }

      if (hotel.hotel_id != vendorHotel.hotel_id) {
        throw {
          status: 401,
          message: "You have no authorization on other vendor's hotel!!",
        };
      }

      if (req.user.role === "vendor") {
        if (req.user.verification) {
          console.log("pass");
          // req.user = user
          req.details = { hotel, vendor };
          next();
        } else {
          throw { status: 403, message: "Verify your account first!" };
        }
      } else {
        throw { status: 401, message: "You have no authorization!!" };
      }
    } catch (e) {
      next(e);
    }
  };

  AdminAuthorizeRole() {
    return [jwtVerificationMidd, roleAuth.adminAuth];
  }
  UserAuthorizeRole() {
    return [jwtVerificationMidd, roleAuth.userAuth];
  }
  VendorAuthorizeRole() {
    return [jwtVerificationMidd, roleAuth.vendorAuth, this.vendorVerify];
  }
}
const roleAuth = new RoleAuth();

module.exports = roleAuth;
