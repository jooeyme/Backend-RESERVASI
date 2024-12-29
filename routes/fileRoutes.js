const express = require('express');
const { uploadFileKolo, deleteFile } = require('../controllers/uploadFile');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {authenticate, authorize} = require("../middleware/authRole")


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('public/uploads/'));
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });


router.post('/upload', upload.single('pdf'), uploadFileKolo);
router.delete('/:id', deleteFile)

module.exports = router;
