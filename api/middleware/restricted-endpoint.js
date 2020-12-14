const jwt = require("jsonwebtoken");
const secret = require("../../secret");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];

  if (token) {
    jwt.verify(token, secret.jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Invalid Token" });
      } else {
        res.decodedJWT = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Token Required" });
  }
};
