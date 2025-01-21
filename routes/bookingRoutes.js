const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/Booking/bookingController");
const {authenticate, authorize} = require("../middleware/authRole")
const {transporter} = require("../middleware/trasnporter")


// Definisikan rute untuk mendapatkan semua pengguna
router.get("/",  bookingController.findAllBooking);
router.get("/my_booking", authenticate, authorize(["user"], "user"), bookingController.findAllBookingByUserId);
router.get("/admin_booking", authenticate, authorize(["admin", "super_admin", "admin_staff", "admin_leader", "admin_tu" ], "admin"), bookingController.findAllBookingByAdminId)
router.post("/room", authenticate, authorize(["user"], "user"), transporter, bookingController.createBookingRoom);
router.post("/room-admin", authenticate, authorize(["admin", "super_admin", "admin_staff", "admin_leader", "admin_tu"], "admin"), bookingController.createBookingSpecialAdmin);
router.post("/tool-admin", authenticate, authorize(["admin", "super_admin", "admin_staff", "admin_leader", "admin_tu"], "admin"), bookingController.createBookingToolSpecialAdmin);
router.post("/tool", authenticate, authorize(["user"], "user"),  transporter, bookingController.createBookingTool);
router.get("/:id",  bookingController.showBookingById);
router.patch("/:id", authenticate, authorize(["super_admin"], "admin"), bookingController.editBooking);
router.delete("/delete/:id",  bookingController.deleteBooking);
router.get("/room/:room_id", bookingController.getBookingByRoomId);
router.get("/tool/:tool_id", bookingController.getBookingByToolId);
router.get("/recap/excel-room", bookingController.DownloadAllRoomBooking);
router.get("/recapPDF/pdf-room", bookingController.DownloadAllRoomRecapPDF);
router.get("/recap/excel-tool", bookingController.DownloadAllToolBooking);
router.get("/recapPDF/pdf-tool", bookingController.DownloadAllToolRecapPDF);
router.get("/day/teh", bookingController.getTodayBookings);
router.post('/return/:id', bookingController.turnInTool);
router.post('/return-room/:id', bookingController.turnInRoom);
router.patch('/verify/:id', authenticate, authorize(["admin", "admin_staff", "admin_leader", "admin_mm", "admin_tu"], "admin"), bookingController.verifyBooking);
router.get('/get-filter/booking', authenticate, bookingController.getFilteredBooking);
router.get('/alternative-booking/:id', bookingController.findAlternativeRooms)
router.patch('/moved-booking/:id', bookingController.moveReservation)
router.get('/status/approved', bookingController.findAllBookingWithApproved)
router.get('/filter-status/booking', authenticate, bookingController.getFilteredBookingNotPending);
router.get('/tracking/status', authenticate, bookingController.getAllTrackingBookings);
router.get('/tracking-tool/status', authenticate, bookingController.getAllTrackingBookingsTool);

module.exports = router;