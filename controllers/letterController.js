// const { IncomingLetter, OutgoingLetter, InvitationLetter, AcademicLetter } = require('../models');
// const { sendEmailWithPdf } = require('../middleware/sendEmail');
// const sequelize = require('../config/database');
// const { error } = require('console');
// const path = require('path');
// const fs = require('fs');

// const getLetterModel = (type) => {
//     switch (type) {
//         case 'incoming':
//             return IncomingLetter;
//         case 'outgoing':
//             return OutgoingLetter;
//         case 'invitation':
//             return InvitationLetter;
//         case 'academic':
//             return AcademicLetter;
//         default:
//             throw new Error('Invalid letter type');
//     }
// };

// const postLetter = async (req, res) => {
//     try {
//         const { type, number, sender, receiver, dateReceived, dateSent, title, sendmail} = req.body;
//         const pdf = req.file;
//         const LetterModel = getLetterModel(type);
        
//         const letterData = {
//             number: number,
//             title: title,
//             attachments: pdf.originalname,
//         };
//         if (type === 'outgoing') {
//             letterData.dateSent = dateSent;
//             letterData.receiver = receiver;
//         } else {
//             letterData.dateReceived = dateReceived;
//             letterData.sender = sender;
//         }

//         if (sendmail === 'true') {
//             const { emails, subject, text } = req.body;
//             const pdfPath = path.join(`public/uploads/${pdf.originalname}`);

//             if (!emails || !subject || !text) {
//                 throw new Error('Emails, subject, and text are required when sendEmail is true.');
//             }
            
//             const newLetter = await LetterModel.create(letterData);
//             //const pdfBuffer = fs.readFileSync(file.path);
//             await sendEmailWithPdf(emails, subject, text, pdfPath);

//             } else {
//                 const newLetter = await LetterModel.create(letterData);
//             }

//             res.status(200).send('Surat berhasil disimpan' + (sendmail === 'true' ? ' dan email berhasil dikirim' : ''));
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// };

// const downloadFile = (req, res) => {
//     const filename = req.params.filename;
//     const filePath = path.join('public/uploads', filename);
//     res.download(filePath, (err) => {
//         if (err) {
//             res.status(500).send('File not found');
//         }
//     });
// };

// const findAllLetters = async (req, res) => {
//     try {
//         const { type } = req.params;
        
//         const LetterModel = getLetterModel(type);
//         const result = await LetterModel.findAll();
        
//         res.status(200).json({
//             message: "Get All Data",
//             data: result,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// } 

// const updateLetter = async (req, res) => {
//     try {
//         const { type, id } = req.params;
//         const { number, sender, receiver, dateReceived, dateSent, title} = req.body;
//         const file = req.file;
//         const LetterModel = getLetterModel(type);

//         const letter = await LetterModel.findOne({
//             where: {
//               id: id,
//             },
//           });
//           console.log(letter);
//         if (!letter) {
//             return res.status(404).send('Surat tidak ditemukan');
//         }

//         let updatedData = {
//             number: number,
//             title: title,
//         };

//         if (type === 'outgoing' && dateSent) {
//             updatedData.dateReceived = dateSent;
//             updatedData.receiver = receiver;
//         } else {
//             updatedData.dateReceived = dateReceived;
//             updatedData.sender = sender;
//         }

//         if (file) {
//             const oldFilePath = path.join('/public/uploads', letter.attachments);
//             if (fs.existsSync(oldFilePath)) {
//                 fs.unlinkSync(oldFilePath);
//             }
//             const newFilePath = `${type}-${number}.pdf`;
//             fs.renameSync(file.path, path.join('/public/uploads', newFilePath));
//             updatedData.attachments = newFilePath;
//         }
//         console.log("Updated Data:", updatedData);

//         const updated = await LetterModel.update(updatedData, { where: { id: id }});

//         res.status(200).json({
//             message: `Success update letter with id ${id}`,
//             data: updated,
//           });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// }

// const deleteLetter = async (req, res) => {
//     try {
//         const { type, id } = req.params;
        
//         const LetterModel = getLetterModel(type);

//         const result = await LetterModel.findOne({
//             where: { id: id },
//           }); 
    
//           if (!result) {
//             return res.status(404).json({ message: `Letter with id ${id} not found.` });
//           } 

//           const filePath = path.join('/public/uploads', letter.attachments);

//         // Remove the letter from the database
//         const delFile = await LetterModel.destroy({
//             where: { id: id },
//         });

//         if (result > 0) {
//             if (fs.existsSync(filePath)) {
//                 fs.unlinkSync(filePath);
//             }
//             return res.status(200).json({ message: `Letter with id ${id} deleted!` });
//         } else {
//             return res.status(404).json({ message: `Letter with id ${id} not found.` });
//         }
//     } catch (error) {
//         res.status(500).json({
//             message: "Internal server error",
//             error: err,
//           });
//     }
// }


// module.exports = { postLetter, downloadFile, findAllLetters, deleteLetter, updateLetter }