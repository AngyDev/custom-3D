const express = require("express");
const api = require("../api/users");

const router = express.Router();

router.get("/users", api.getUsers);
router.get("/user/:id", api.getUserById);
router.post("/user", api.createUser);
router.delete("/user/:id", api.deleteUser);

module.exports = router;