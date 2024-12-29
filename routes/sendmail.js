const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sendEmailWithPdf } = require('../middleware/sendEmail');



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(`/`, upload.single('pdf'), sendEmailWithPdf);

module.exports = router;
