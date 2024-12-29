const express = require("express");
const router = express.Router();
const adminController = require("../controllers/Users/adminController");

router.get('/', adminController.getAdmin);
router.patch('/edit/:id', adminController.updateAdmin);
router.delete('/delete/:id', adminController.deleteAdmin);
router.get(`/personal/:id`, adminController.getAdminById);

module.exports = router;