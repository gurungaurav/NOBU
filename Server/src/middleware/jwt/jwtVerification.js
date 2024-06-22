const jwt = require("jsonwebtoken");
const successHandler = require("../../utils/handler/successHandler");
const { jwtVerification } = require("../../utils/jwt/token-manager");
const UserModel = require("../../model/client/user");

const jwtVerificationMidd = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    console.log(bearerToken);
    if (!bearerToken) {
      throw { status: 400, message: "No token received!" };
    }

    const [Bearer, Token] = bearerToken.split(" ");

    if (Bearer !== "Bearer") {
      throw { status: 400, message: "Invalid token type!" };
    }

    if (!Token) {
      throw { status: 400, message: "Invalid token!!" };
    }

    const verify = jwtVerification(Token);

    if (!verify) {
      throw { status: 500, message: "Invalid token" };
    }

    const user = await UserModel.findOne({ where: { user_id: verify.id } });

    if (!user) {
      throw { status: 404, message: "User not found. Please register!" };
    }

    const name = verify.name;
    const id = verify.id;
    const role = verify.role;
    const profile_picture = verify.profile_picture;
    const verification = user.verified;
    // console.log('for',role);
    req.token = { Token };
    req.user = { name, id, role, profile_picture, verification };
    next();

    // successHandler(res,{name,id,role}, "Verified");
  } catch (e) {
    next(e);
  }
};

module.exports = jwtVerificationMidd;
