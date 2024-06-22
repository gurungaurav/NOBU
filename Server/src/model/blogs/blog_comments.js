const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");

const BlogCommentModel = sequelize.define("blog_comments", {
  comment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // likes: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true,
  //   defaultValue: 0,
  // },
  // dislikes: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true,
  //   defaultValue: 0,
  // },
});

module.exports = BlogCommentModel;
