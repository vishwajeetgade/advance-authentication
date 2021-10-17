const express = require('express');
const router = express.Router();
const { register, login, forgetpassword, resetpassword, privateRoute } = require('../controllers/auth');
const {protect} = require("../middleware/auth");

router.route("/private").get(protect, privateRoute);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgetpassword").post(forgetpassword);
router.route("/resetpassword/:resettoken").put(resetpassword);

module.exports = router;