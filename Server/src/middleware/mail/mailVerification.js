const OtpModel = require("../../model/client/otp");
const TokenModel = require("../../model/client/token");
const UserModel = require("../../model/client/user");
const HotelModel = require("../../model/hotel/hotel");
const successHandler = require("../../utils/handler/successHandler");
const { sendMail } = require("../../utils/mail/mailSender");

//! This is for mail verification for login
//? http://localhost:1000/api/nobu/user/:id/verify/:token
const mailVerification = async (req, res, next) => {
  try {
    const id = req.params.id;
    // const token = req.params.token;

    const user_Id = await UserModel.findOne({ where: { user_id: id } });

    if (!user_Id) {
      throw {
        status: 404,
        message:
          "User not found. Please make sure you entered the correct user ID.",
      };
    }

    const user_Token = await TokenModel.findOne({ where: { user_id: id } });

    if (!user_Token) {
      throw {
        status: 400,
        message: "User is already verified. You don't need to verify again.",
      };
    }

    req.token = { token: user_Token, userId: id };
    next();
  } catch (e) {
    next(e);
  }
};

//!This is for checking the email so that the user has been registered or not
//!For reseting password
//? http://localhost:1000/api/nobu/user/email/getOTP
const emailVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ where: { email: email } });

    if (!user) {
      throw {
        status: 404,
        message: "User not registered. Please sign up first.",
      };
    }

    const max = 9999;
    const min = 1000;

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    const otpCode = await OtpModel.create({
      otp_code: randomNumber,
      user_id: user.user_id,
    });

    // const url = `http://localhost:3000/nobu/user/verify/OTPCode/55zdgsd_sdy2dsgdusd127_hd123/${otpCode.otp_code}`;

    const otp = `Your OTP code for password reset is: ${otpCode.otp_code}`;
    await sendMail(user.email, "OTP Code for Password Reset", otp);

    const userDetails = { user_id: user.user_id, email: user.email };
    successHandler(
      res,
      201,
      userDetails,
      "An OTP code has been sent to your email. Please check your inbox (and spam folder)!"
    );
  } catch (e) {
    next(e);
  }
};
const checkContactUsMidd = async (req, res, next) => {
  try {
    const { hotel_id } = req.params;

    if (!hotel_id) {
      throw { status: 404, message: "Please provide a proper hotel ID." };
    }

    const hotel = await HotelModel.findOne({ where: { hotel_id: hotel_id } });

    if (!hotel) {
      throw { status: 404, message: "Hotel not found." };
    }

    // const user = await HotelModel.findOne({ where: { user_id: user_id } });

    // if (!user) {
    //   throw { status: 404, message: "No User found" };
    // }

    const vendor = await UserModel.findOne({
      where: { user_id: hotel.vendor_id },
    });

    if (!vendor) {
      throw { status: 404, message: "Vendor not found." };
    }

    req.contact = { vendor };
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = { mailVerification, emailVerification, checkContactUsMidd };
