const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const sendMail = require("../../utils/mail/mailSender");
const UserModel = require("../../model/client/user");
const TokenModel = require("../../model/client/token");
const yup = require("yup");

class UserValidator {
  //? http://localhost:1000/api/nobu/user/registerUser
  validateUserRegister = (schema) => async (req, res, next) => {
    try {
      await schema.validate({
        body: req.body,
      });

      const uriFromCloudinary = req.profile_picture;
      // console.log(uriFromCloudinary, "from validate user");
      req.profile_picture = uriFromCloudinary;

      next();
    } catch (e) {
      next(e);
    }
  };

  //? http://localhost:1000/api/nobu/user/loginUser
  validatedUserLogin = (schema) => async (req, res, next) => {
    try {
      await schema.validate({
        body: req.body,
      });
      next();
    } catch (e) {
      next(e);
    }
  };

  //? http://localhost:1000/api/nobu/user/userPasswordChange
  validateUserResetPass = (schema) => async (req, res, next) => {
    try {
      await schema.validate({
        body: req.body,
      });
      next();
    } catch (e) {
      next(e);
    }
  };
  //? http://localhost:1000/api/nobu/user/bookmark/:room_id/:hotel_id/:user_id
  validateBookmarks = (schema) => async (req, res, next) => {
    try {
      await schema.validate({
        params: req.params,
      });
      console.log(req.params);
      next();
    } catch (e) {
      next(e);
    }
  };

  //? http://localhost:1000/api/nobu/user/addRoomReview/:user_id/:hotel_id
  validateHotelReview = (schema) => async (req, res, next) => {
    try {
      await schema.validate({
        body: req.body,
        params: req.params,
      });
      next();
    } catch (e) {
      next(e);
    }
  };
}

const userValidator = new UserValidator();
module.exports = userValidator;
