const { DataTypes } = require("sequelize");
const UserModel = require("./user");
const sequelize = require("../../config/dbConfig");

const TokenModel = sequelize.define("tokens", {
  token_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  token_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

UserModel.hasOne(TokenModel, { foreignKey: "user_id" });
module.exports = TokenModel;
