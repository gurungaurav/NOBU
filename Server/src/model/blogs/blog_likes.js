const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const UserModel = require("../client/user");
const BlogModel = require("./blog");


const BlogLikesModel = sequelize.define('blog_likes',{

    blog_likes_id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        unique:true,
        primaryKey:true
    },
    
})


UserModel.hasMany(BlogLikesModel, {foreignKey:"user_id", onDelete:'CASCADE'})
BlogModel.hasOne(BlogLikesModel,{foreignKey:"blog_id", onDelete:'CASCADE'})
module.exports = BlogLikesModel