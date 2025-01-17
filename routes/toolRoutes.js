const express = require("express");
const router = express.Router();
const toolController = require("../controllers/Booking/toolController");
const {uploadImage} = require("../middleware/uploadMiddleware")
const authRole = require("../middleware/authRole");


router.get("/", toolController.findAllTool);
router.get("/toolId", toolController.findAllToolsId)
router.post("/", uploadImage.single('gambar_tool'), toolController.createTool);
router.get("/:id", toolController.showToolById);
router.patch("/edit/:id", uploadImage.single('gambar_tool'), toolController.editTool);
router.delete("/:id", toolController.deleteTool);

module.exports = router;