const express = require("express");
const router = express.Router();
const roomController = require("../controllers/Booking/roomController");
const {uploadImage} = require("../middleware/uploadMiddleware");
const authRole = require("../middleware/authRole")


router.get("/",  roomController.findAllRoom);
router.post("/",  uploadImage.single('gambar_room'), roomController.createRoom);
router.get("/:id",  roomController.showRoomById);
router.patch("/edit/:id", uploadImage.single('gambar_room'), roomController.editRoom);
router.delete("/:id",  roomController.deleteRoom);

module.exports = router;