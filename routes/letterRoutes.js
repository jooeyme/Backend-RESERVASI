// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const { postLetter, downloadFile, findAllLetters, deleteLetter, updateLetter } = require('../controllers/letterController');

// const router = express.Router();

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join('public/uploads/'));
//     },
//     filename: (req, file, cb) => {
//         const fileName = file.originalname;
//         cb(null, fileName);
//     }
// });

// const upload = multer({ storage: storage });

// router.post('/', upload.single('pdf'), postLetter);
// router.get(`/file/:filename`, downloadFile);
// router.get('/files/:type', findAllLetters);
// router.delete('/files/:type/:id', deleteLetter);
// router.patch('/files/:type/:id', updateLetter);

// module.exports = router;
