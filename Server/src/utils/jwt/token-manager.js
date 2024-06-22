const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET_KEY;

//!For Creation of token
const jwtCreation = (Name, id, role, profile_picture) => {
  const token = jwt.sign(
    { name: Name, id: id, role: role, profile_picture: profile_picture },
    secretKey,
    {
      expiresIn: "10days",
    }
  );
  return token;
};

//!Verification of token
const jwtVerification = (token) => {
  const tok = jwt.verify(token, secretKey);
  // console.log(tok);
  return tok;
};

module.exports = { jwtVerification, jwtCreation };
