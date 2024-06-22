const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const BlogCommentModel = require("./blog_comments");

const BlogModel = sequelize.define("blogs", {
  blog_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

BlogModel.hasMany(BlogCommentModel, {
  foreignKey: "blog_id",
  onDelete: "CASCADE",
});

module.exports = BlogModel;
