const express = require("express");
const usercontroller = require("../controller/usercontroller");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", usercontroller.register);
router.post("/login", usercontroller.login);
router.get("/userinfo", auth, usercontroller.userinfo);

module.exports = router;
