const express = require('express');
const router = express.Router();
const { uploadOutgoingLetter } = require('../middleware/uploadMiddleware')
const outgoingLetterController = require('../controllers/Letters/outgoingLetterController');

router.get('/', outgoingLetterController.getAllOutgoingLetter);
router.get('/:id', outgoingLetterController.getOutgoingLetterById);
router.post('/add', uploadOutgoingLetter.single('attachments'), outgoingLetterController.createOutgoingLetter);
router.patch('/edit/:id', uploadOutgoingLetter.single('attachments'), outgoingLetterController.updateOutgoingLetter);
router.delete('/delete/:id', outgoingLetterController.deleteOutgoingLetter)

module.exports = router