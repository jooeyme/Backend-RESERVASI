const express = require('express');
const { generatePDF, reqLetters, getAllReq } = require('../controllers/generatePDF');
const router = express.Router();



router.post('/generate-pdf', generatePDF);
router.post('/reqLetter', reqLetters);
router.post('/all', getAllReq)

module.exports = router;
