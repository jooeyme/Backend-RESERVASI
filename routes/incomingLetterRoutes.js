const express = require('express');
const router = express.Router();
const { uploadIncomingLetter } = require('../middleware/uploadMiddleware')
const incomingLetterController = require('../controllers/Letters/incomingLetterController')


router.get('/', incomingLetterController.getAllIncomingLetter);
router.get('/:id', incomingLetterController.getIncomingLetterById);
router.post('/add', uploadIncomingLetter.single('attachments'), incomingLetterController.createIncomingLetter);
router.patch('/edit/:id', uploadIncomingLetter.single('attachments'), incomingLetterController.updateIncomingLetter);
router.delete('/delete/:id', incomingLetterController.deleteIncomingLetter)

module.exports = router