import { UsersController } from "../controllers/UsersControllers";
import { HttpError } from "../error";
import { errorHandler } from "../utils";
import bcrypt from "bcryptjs";

const getUsers = errorHandler(async (req, res) => {
  const users = await UsersController.getUsers();

  return users;
});

const getUserById = errorHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new HttpError(400, "Missing id");
  }

  const user = await UsersController.getUserById(id);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
});

const createUser = errorHandler(async (req, res) => {
  // Gets user input
  const { firstName, lastName, email, password, role } = req.body;

  // Validate user input
  if (!(firstName && lastName && email && password && role)) {
    throw new HttpError(400, "Missing required fields");
  }

  // Checks if the user already exists
  // TODO: Use only the email for the checks?
  const oldUser = await UsersController.getUserByEmail(email);

  if (oldUser.length > 0) {
    throw new HttpError(409, "User already exists");
  }

  // Encrypt password
  const encryptedPassword = await bcrypt.hash(password, 10);

  // Creates the user
  const createdUser = await UsersController.createUser({
    firstName,
    lastName,
    email,
    password: encryptedPassword,
    role
  });

  return createdUser;
});

const deleteUser = errorHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new HttpError(400, "Missing id");
  }

  const deletedUser = await UsersController.deleteUser(id);

  if (deleteUser === 0) {
    throw new HttpError(404, "User not found");
  } else {
    return {message: "User deleted"};
  }
});

module.exports = { getUsers, getUserById, createUser, deleteUser };
