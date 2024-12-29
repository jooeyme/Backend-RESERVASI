const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/Booking/bookingController");
const {authenticate, authorize} = require("../middleware/authRole")
const {transporter} = require("../middleware/trasnporter")


// Definisikan rute untuk mendapatkan semua pengguna
router.get("/",  bookingController.findAllBooking);
router.get("/my_booking", authenticate, authorize(["user"], "user"), bookingController.findAllBookingByUserId);
router.post("/room", authenticate, authorize(["user"], "user"), transporter, bookingController.createBookingRoom);
router.post("/tool", authenticate, authorize(["user"], "user"),  bookingController.createBookingTool);
router.get("/:id",  bookingController.showBookingById);
router.patch("/:id", authenticate, authorize(["admin","admin_staff","super_admin"], "admin"), bookingController.editBooking);
router.delete("/delete/:id",  bookingController.deleteBooking);
router.get("/room/:room_id", bookingController.getBookingByRoomId);
router.get("/tool/:tool_id", bookingController.getBookingByToolId);
router.get("/excel/:year/:month", bookingController.DownloadAllBooking);
router.get("/day/teh", bookingController.getTodayBookings);
router.post('/return/:id', bookingController.turnInTool)
router.post('/return-room/:id', bookingController.turnInRoom)
module.exports = router;