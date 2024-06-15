const { SuratReservasi } = require('../models');
const path = require('path');
const { User } = require("../models");

exports.uploadFile = async (req, res) => {
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const userId = req.userData.id;
    const pdfFile = req.files.pdfFile;

     // Logging to debug the issue
     console.log('Files received:', req.files);
     console.log('PDF file:', pdfFile);
 
     if (!pdfFile || !pdfFile.name) {
         return res.status(400).send('Invalid file upload.');
     }

    const uploadPath = path.join(__dirname, '../public/uploads', pdfFile.name);

    try {
        await pdfFile.mv(uploadPath);

        const newFile = await SuratReservasi.create({
            user_id: userId,
            nama: pdfFile.name,
            path: `/public/uploads/${pdfFile.name}`
        });

        res.json(newFile);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getFiles = async (req, res) => {
    try {
        const files = await SuratReservasi.findAll({include: [User]});
        res.json(files);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getFilesByUserId = async (req, res) => {
    try {
        const userId = req.userData.id;
        const files = await SuratReservasi.findAll({
            where: {
                user_id: userId
            }, 
            include: [User] 
        })
        res.json(files);
    } catch (error) {
        res.status(500).send(error);
    }
}
