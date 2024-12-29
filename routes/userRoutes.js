const express = require("express");
const router = express.Router();
const userController = require("../controllers/Users/userController");

router.get('/', userController.getUser);
router.patch('/edit/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);
router.get('/personal/:id', userController.getUserById);

module.exports = router;