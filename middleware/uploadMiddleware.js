const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createDirectory = (directory) => {
  if (!fs.existsSync(directory)){
    fs.mkdirSync(directory, {recursive: true});
  }
}

const ImagesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const imagePath = path.join('public/images/');
    createDirectory(imagePath);
    cb(null, imagePath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});

const DocumentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const documentPath = path.join('public/documents/');
    //createDirectory(documentPath);
    cb(null, documentPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, base + '-' + Date.now() + ext);
  }
});





const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya gambar yang diizinkan'), false);
    }
  };
  
  // Membuat middleware upload
  const uploadImage = multer({
    storage: ImagesStorage,
    fileFilter: fileFilter,
  });

  const uploadDocument = multer({
    storage: DocumentStorage,
  });

  

  module.exports = {
    uploadImage,
    uploadDocument,
    uploadIncomingLetter,
    uploadOutgoingLetter
  };