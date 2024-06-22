const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/dbConfig");
const BlogModel = require("./blog");


const BlogTagsModel = sequelize.define('blog_tags',{

    tag_id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        unique:true,
        primaryKey:true
    },
    tag_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:false
    }
    
})

BlogTagsModel.hasOne(BlogModel,{foreignKey:'blog_tag_id'})


module.exports = BlogTagsModel