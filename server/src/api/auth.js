const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { TokenController } = require("../controllers/TokenController");
const { UsersController } = require("../controllers/UsersController");
const { HttpError } = require("../error");
const { verifyRefreshToken } = require("../middleware/auth");
const { errorHandler } = require("../utils");
const { parseJwt, isExpired } = require("../utils/token-utils");
const { validateUser, validateLogin } = require("../validation/validate");

/**
 * Generate a new token for the user
 * @param {String} userId
 * @returns The token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

/**
 * Generate a new refresh token for the user
 * @param {String} userId
 * @returns The refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
};

/**
 * Login a user
 */
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

    let newRefreshToken = "";

    if (refreshTokenUser.length === 0) {
      // if the user doesn't have a refresh token create one
      newRefreshToken = generateRefreshToken(user[0].id);

      // save the refresh token in the database
      await TokenController.createToken(user[0].id, newRefreshToken);
    } else {
      // decode the refresh token
      const decoded = parseJwt(refreshTokenUser[0].token);

      // checks if the refresh token is expired
      if (isExpired(decoded)) {
        // if the refresh token is expired create a new one
        newRefreshToken = generateRefreshToken(user[0].id);

        // update the refresh token in the database
        await TokenController.updateToken(refreshTokenUser[0].id, newRefreshToken);
      }
    }

    const token = generateToken(user[0].id);

    // set the token in the cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.cookie("refreshToken", newRefreshToken !== "" ? newRefreshToken : refreshTokenUser[0].token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 14 * 60 * 60 * 1000, // 7 days
    });

    // return the user
    return user;
  } else {
    // if the password is incorrect return an error
    throw new HttpError(409, "Invalid password");
  }
});

/**
 * Register a new user
 */
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
  const savedToken = await TokenController.createToken(newUser.id, refreshToken);

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

/**
 * Refresh the access token
 */
const refreshToken = errorHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  let newRefreshToken = "";

  // decode the refresh token
  const decoded = parseJwt(refreshToken);

  // if the refreshToken is expired create a new one
  if (isExpired(decoded)) {
    // remove token from the database
    await TokenController.deleteTokenByUserId(decoded.userId);

    res.cookie("token", "", { httpOnly: false, sameSite: "lax", secure: false, maxAge: 0 });
    res.cookie("refreshToken", "", { httpOnly: false, sameSite: "lax", secure: false, maxAge: 0 });

    throw new HttpError(403, "Refresh token expired");
  }

  // verify the jwt token and if it is present on the db
  const decodedToken = await verifyRefreshToken(refreshToken, res);

  // check if the token exists
  const tokenExists = await TokenController.getTokenByUserId(decodedToken.userId);

  if (tokenExists.length === 0) {
    throw new HttpError(403, "Invalid refresh token");
  }

  // create a new token for the user
  const newToken = generateToken(newRefreshToken.userId);

  // set the token in the cookie
  res.cookie("token", newToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  return { message: "Token refreshed" };
});

const logout = errorHandler(async (req, res) => {
  // remove token from the database
  await TokenController.deleteTokenByUserId(req.body.userId);

  res.cookie("token", "", { httpOnly: false, sameSite: "lax", secure: false, maxAge: 0 });
  res.cookie("refreshToken", "", { httpOnly: false, sameSite: "lax", secure: false, maxAge: 0 });

  return { message: "Success" };
});

const changePassword = errorHandler(async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  // check if the user exists
  const user = await UsersController.getUserById(userId);

  if (!user) {
    throw new HttpError(404, "User not found");
  }
  // compare the old password with the one in the db
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (isPasswordValid) {
    // encrypt the new password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    // update the password in the database
    await UsersController.updateUser(userId, { password: encryptedPassword });

    return { message: "Password changed" };
  } else {
    throw new HttpError(409, "The old password is incorrect");
  }
});

module.exports = { login, register, refreshToken, logout, changePassword };
