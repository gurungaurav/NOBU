const { DataTypes } = require("sequelize");
const TokenModel = require("./token");
const OtpModel = require("./otp");
const BlogModel = require("../blogs/blog");
const BlogCommentModel = require("../blogs/blog_comments");
const sequelize = require("../../config/dbConfig");
const HotelModel = require("../hotel/hotel");

//!So i will use rejected as the default value becuase to differentiate between user and vendor like the rejected means the user is still user
//! So that i can differentiate between user and vendor like the rejected means user, and verified and pending means vendor
//!This was used so that while admin checks the vendors to be verified then  during filtration i can differentiate between vendor and user

const UserModel = sequelize.define("users", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Please provide a password!!",
      },
    },
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:
      "https://res.cloudinary.com/dr1giexhn/image/upload/v1712556160/user_geqzhb.png",
  },
  roles: {
    type: DataTypes.ENUM("user", "admin", "vendor"),
    defaultValue: "user",
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

//!The enum for verified are verified for verified, not verified for not verified user and pending is if the admin founds any suspicious on that user
//!So basically the pending is the type when the admin takes the unverifies the user on the suspicious acts
//TODO: Will do this later on on adding the enums for verification status
UserModel.hasOne(OtpModel, { foreignKey: "user_id" });
UserModel.hasMany(BlogModel, { foreignKey: "author_id", onDelete: "CASCADE" });
UserModel.hasMany(BlogCommentModel, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
UserModel.hasOne(HotelModel, { foreignKey: "vendor_id", onDelete: "CASCADE" });
module.exports = UserModel;
