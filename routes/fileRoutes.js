const express = require('express');
const { uploadFile, getFiles, getFilesByUserId } = require('../middleware/uploadFile');
const router = express.Router();
const {authenticate, authorize} = require("../middleware/authRole")


router.post('/upload', authenticate, uploadFile);
router.get('/all', getFiles);
router.get('/', authenticate, getFilesByUserId);	

module.exports = router;
