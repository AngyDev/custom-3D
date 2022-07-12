const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UsersController } = require("../controllers/UsersController");
const { HttpError } = require("../error");
const { errorHandler } = require("../utils");
const { validateUser, validateLogin } = require("../validation/validate");

const generateToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
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
    const token = generateToken(user[0].id);
    // set the token in the cookie

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // return the user
    return user;
  } else {
    // if the password is incorrect return an error
    throw new HttpError(401, "Invalid password");
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

  // set the token in the cookie
  res.cookie("token", token, {
    httpOnly: true, // with true it will not be accessible from client side and we can't see the value in the cookie object in the browser development tools
    sameSite: "lax",
    secure: false,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
  // return the user
  return newUser;
});

const logout = errorHandler(async (req, res) => {
  res.cookie("token", "", { httpOnly: false, sameSite: "lax", secure: false, maxAge: 0 });
  res.cookie("refreshToken", "", { httpOnly: false, sameSite: "lax", secure: false, maxAge: 0 });

  return { message: "Success" };
});

module.exports = { login, register, logout };
