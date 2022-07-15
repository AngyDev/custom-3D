const express = require("express");
const api = require("../api/auth");

const router = express.Router();

router.post("/login", api.login);
router.post("/register", api.register);
router.post("/refresh", api.refreshToken);
router.post("/logout", api.logout);
router.post("/change-password", api.changePassword);

module.exports = router;