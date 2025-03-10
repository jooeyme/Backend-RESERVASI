const express = require("express");
const router = express.Router();
const roomRoutes = require("./roomRoutes"); // Sesuaikan dengan file rute pengguna yang sesuai
const toolRoutes = require("./toolRoutes");
const bookingRoutes = require("./bookingRoutes");
const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");
const authRoutes = require("./authRoutes");
const sendmail = require("./sendmail");


router.get('/health-check', (req, res) => {
    res.status(200).json({
        message: 'Connected Successfully to Server'
    });
});

// Rute pengguna diarahkan ke file rute terkait pengguna
router.use("/room", roomRoutes); // Semua rute terkait pengguna akan diarahkan ke usersRoutes
router.use("/tool", toolRoutes);
router.use("/booking", bookingRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);

router.use("/sendmail", sendmail);



module.exports = router;