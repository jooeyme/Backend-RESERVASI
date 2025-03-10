const express = require("express");
const router = express.Router();
const authController = require("../controllers/Users/authController");
const {transporter} = require("../middleware/trasnporter")

router.post('/forgot-password', transporter, authController.ForgotPassword);
router.post('/reset-password/:token', authController.ResetPassword);
router.post('/register', authController.Register)
router.post('/add-admin', authController.AddAdmin)
router.post('/login', authController.Login);
router.post('/login-admin', authController.LoginAdmin);

module.exports = router;