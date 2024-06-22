const multer = require("multer");
const cloudinary = require("cloudinary");
const streamifier = require("streamifier");
const successHandler = require("../../utils/handler/successHandler");
require("dotenv").config();

// image --> code save ---> upload ---> removed
// image ---> memory save ----> upload

const storage = multer.memoryStorage();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.COULD_API_SECRET_KEY,
  secure: true,
});

class UploadCloudImage {
  //!For users pfp upload
  //? http://localhost:1000/api/nobu/user/registerUser
  //? http://localhost:1000/api/nobu/user/updateUser/:user_id

  uploadUserProfile(folder = "site") {
    const upload = multer({ storage }).fields([
      {
        name: "profile_picture",
        maxCount: 1,
      },
    ]);

    async function uploadToCloudinary(req, res, next) {
      // req.file = req.photo
      // const{name,email,password} = req.user ;
      // const file = req.file
      // console.log('cloud',file);
      // console.log(name,'cloud');

      try {
        let uploadFromBuffer = (buffer) => {
          return new Promise((resolve, reject) => {
            let cld_upload_stream = cloudinary.v2.uploader.upload_stream(
              {
                folder,
              },
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );

            streamifier.createReadStream(buffer).pipe(cld_upload_stream);
          });
        };

        console.log(req.files);

        if (req.files?.profile_picture) {
          const profilePictureBuffer = req.files?.profile_picture[0].buffer;

          const uriFromCloudinary = await uploadFromBuffer(
            profilePictureBuffer
          );
          // console.log(uriFromCloudinary);
          // console.log(uriFromCloudinary.secure_url);
          console.log("hshd", uriFromCloudinary);

          req.profile_picture = uriFromCloudinary;
        }

        //!Just injecting the values received from the validation and then to the user controller
        // const{name, email, password} = req.user
        // req.user = {name,email,password}

        next();
      } catch (e) {
        next(e);
      }
    }

    return [upload, uploadToCloudinary];
  }

  //!For blog Title image
  //? http://localhost:1000/api/nobu/user/registerUser
  uploadBlogImage(folder = "site") {
    const upload = multer({ storage }).fields([
      {
        name: "picture",
        maxCount: 1,
      },
    ]);

    async function uploadToCloudinary(req, res, next) {
      try {
        console.log(req.files, "user");
        let uploadFromBuffer = (buffer) => {
          return new Promise((resolve, reject) => {
            let cld_upload_stream = cloudinary.v2.uploader.upload_stream(
              {
                folder,
              },
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );

            streamifier.createReadStream(buffer).pipe(cld_upload_stream);
          });
        };

        console.log(req.files);

        if (req.files?.picture) {
          const blogImageBuffer = req.files?.picture[0].buffer;

          const uriFromCloudinary = await uploadFromBuffer(blogImageBuffer);

          req.blog_Image = uriFromCloudinary;
        }

        next();
      } catch (e) {
        next(e);
      }
    }

    return [upload, uploadToCloudinary];
  }

  //!For hotel  pictire upload
  //? http://localhost:1000/api/nobu/vendor/addRooms/:hotel_id
  uploadHotelImage(folder = "site") {
    const upload = multer({ storage }).fields([
      {
        name: "other_pictures",
        maxCount: 10,
      },
      {
        name: "main_picture",
        maxCount: 1,
      },
    ]);

    async function uploadToCloudinary(req, res, next) {
      try {
        let uploadFromBuffer = (buffer) => {
          return new Promise((resolve, reject) => {
            let cld_upload_stream = cloudinary.v2.uploader.upload_stream(
              {
                folder,
              },
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );

            streamifier.createReadStream(buffer).pipe(cld_upload_stream);
          });
        };

        if (req.files?.main_picture) {
          const hotelImageBuffer = req.files?.main_picture[0].buffer;

          const urlFromCloudinary = await uploadFromBuffer(hotelImageBuffer);

          req.hotel_Image = urlFromCloudinary;
        }

        console.log(req.files);
        console.log(req.files.main_picture, "jajaja");

        const promisesToBeResolved = [];
        if (req.files?.other_pictures) {
          for (let i = 0; i < req.files?.other_pictures.length; i++) {
            const galleryFromBuffer = req.files?.other_pictures[i].buffer;
            promisesToBeResolved.push(uploadFromBuffer(galleryFromBuffer));
          }
          const uriFromCloudinary = await Promise.all(promisesToBeResolved);
          req.hotel_Images = uriFromCloudinary;
        }
        next();
      } catch (e) {
        next(e);
      }
    }

    return [upload, uploadToCloudinary];
  }

  //!For hotel room pictire upload
  //? http://localhost:1000/api/nobu/vendor/addRooms/:hotel_id
  uploadRoomImage(folder = "site") {
    const upload = multer({ storage }).fields([
      {
        name: "room_pictures",
        maxCount: 10,
      },
    ]);

    async function uploadToCloudinary(req, res, next) {
      try {
        // console.log(req.files,'user');
        let uploadFromBuffer = (buffer) => {
          return new Promise((resolve, reject) => {
            let cld_upload_stream = cloudinary.v2.uploader.upload_stream(
              {
                folder,
              },
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );

            streamifier.createReadStream(buffer).pipe(cld_upload_stream);
          });
        };

        const promisesToBeResolved = [];
        if (req.files?.room_pictures) {
          for (let i = 0; i < req.files?.room_pictures.length; i++) {
            const galleryFromBuffer = req.files?.room_pictures[i].buffer;
            promisesToBeResolved.push(uploadFromBuffer(galleryFromBuffer));
          }
          const uriFromCloudinary = await Promise.all(promisesToBeResolved);

          req.room_Image = uriFromCloudinary;
          console.log(uriFromCloudinary);
        }

        next();
        //  return successHandler(res,201,uris,"Images uploaded")

        // if (req.files?.blog_Image) {
        //   const blogImageBuffer = req.files?.blog_Image[0].buffer;

        //   const uriFromCloudinary = await uploadFromBuffer(blogImageBuffer);

        //   req.blog_Image = uriFromCloudinary;
        // }
      } catch (e) {
        next(e);
      }
    }

    return [upload, uploadToCloudinary];
  }
}

const uploadCloudImage = new UploadCloudImage();
module.exports = uploadCloudImage;
