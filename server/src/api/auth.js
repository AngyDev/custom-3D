const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { TokenController } = require("../controllers/TokenController");
const { UsersController } = require("../controllers/UsersController");
const { HttpError } = require("../error");
const { verifyRefreshToken } = require("../middleware/auth");
const { errorHandler } = require("../utils");
const { validateUser, validateLogin } = require("../validation/validate");

const generateToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: "15s" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
};

const login = errorHandler(async (req, res) => {
  // get the email and password from the request
  const { email, password } = req.body;

  // verify the email and password
  validateLogin(email, password);

  // get the user from the database
  const user = await UsersController.getUserByEmail(email);

  if (user.length === 0) {
    throw new HttpError(404, "User not found");
  }

  // if it exists compare the password
  const isPasswordValid = await bcrypt.compare(password, user[0].password);

  // if the password is correct create a token for the user
  if (isPasswordValid) {
    // checks if the user has a refresh token
    const refreshTokenUser = await TokenController.getTokenByUserId(user[0].id);

    console.log("refreshToken", refreshTokenUser);

    let newRefreshToken = "";

    if (refreshTokenUser.length === 0) {
      // if the user doesn't have a refresh token create one
      newRefreshToken = generateRefreshToken(user[0].id);

      // save the refresh token in the database
      await TokenController.createToken(user[0].id, newRefreshToken);
    }

    const token = generateToken(user[0].id);

    // set the token in the cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.cookie("refreshToken", refreshTokenUser.length === 0 ? newRefreshToken : refreshTokenUser[0].token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 14 * 60 * 60 * 1000, // 7 days
    });

    // return the user
    return user;
  } else {
    // if the password is incorrect return an error
    throw new HttpError(403, "Invalid password");
  }
});

const register = errorHandler(async (req, res) => {
  // get the user from the request
  const { firstName, lastName, email, password } = req.body;

  // validate the user input
  validateUser(firstName, lastName, email, password);

  // check if the user already exists
  const oldUser = await UsersController.getUserByEmail(email);

  if (oldUser.length > 0) {
    throw new HttpError(409, "User already exists. Please login.");
  }

  // encrypt the password
  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = { firstName, lastName, email, password: encryptedPassword };

  // create the user
  const newUser = await UsersController.createUser(user);

  // create token for the user
  const token = generateToken(newUser.id);
  // create the refresh token for the user
  const refreshToken = generateRefreshToken(newUser.id);

  // save the refresh token in the database
  const savedToken = await TokenController.createToken(refreshToken, newUser.id);

  console.log(savedToken);

  // set the token in the cookie
  res.cookie("token", token, {
    httpOnly: true, // with true it will not be accessible from client side and we can't see the value in the cookie object in the browser development tools
    sameSite: "lax",
    secure: false,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 14 * 60 * 60 * 1000, // 7 days
  });

  // return the user
  return newUser;
});

const refreshToken = errorHandler(async (req, res) => {
  try {
    // get the token from the cookie
    const refreshToken = req.cookies.refreshToken;

    // verify the jwt token and if it is present on the db
    const decodedToken = verifyRefreshToken(refreshToken);

    // create a new token for the user
    const newToken = generateToken(decodedToken.userId);

    // set the token in the cookie
    res.cookie("token", newToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return { message: "Token refreshed" };
  } catch (error) {
    throw new HttpError(401, "Invalid refresh token");
  }
});

const logout = errorHandler(async (req, res) => {
  res.cookie("token", "", { httpOnly: false, sameSite: "lax", secure: false, maxAge: 0 });
  res.cookie("refreshToken", "", { httpOnly: false, sameSite: "lax", secure: false, maxAge: 0 });

  return { message: "Success" };
});

module.exports = { login, register, refreshToken, logout };
