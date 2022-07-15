const { HttpError } = require("../error");
const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;

// get the token from the cookie and verify it
const verifyToken = (req, res, next) => {
  console.log("verifyToken");
  const token = req.cookies.token;

  if (!token) {
    throw new HttpError(401, "No token found");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }

    req.user = decoded;

    next();
  });
};

const verifyRefreshToken = async (token) => {
  const decodeToken = () => {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN);
    } catch (error) {
      throw new HttpError(403, "Invalid refresh token");
    }
  };

  const decodedToken = decodeToken();

  return decodedToken;
};

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send("Token expired");
  }

  return res.status(401).send("Unauthorized");
};

module.exports = { verifyToken, verifyRefreshToken };
