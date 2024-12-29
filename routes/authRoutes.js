const express = require("express");
const router = express.Router();
const authController = require("../controllers/Users/authController");

router.post('/register', authController.Register)
router.post('/add-admin', authController.AddAdmin)
router.post('/login', authController.Login);
router.post('/login-admin', authController.LoginAdmin);

module.exports = router;