const express = require('express');
const router = express.Router();
const { uploadDocument } = require('../middleware/uploadMiddleware')
const documentController = require('../controllers/HumanResource/documentController')


router.get('/', documentController.getAllDocuments);
router.get("/employee/:nip", documentController.getDocumentsByEmployeeId);
router.post('/add-doc', uploadDocument.single('file_path'), documentController.createDocument);
router.patch('/edit/:id', uploadDocument.single('file_path'), documentController.updateDocument);
router.delete('/delete/:id', documentController.deleteDocument);

module.exports = router;