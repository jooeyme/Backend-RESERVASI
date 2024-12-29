const { applicationLetter } = require("../models");
const { PDFDocument, StandardFonts } = require('pdf-lib');
const path = require('path');
const fs = require('fs');
const fontkit = require('fontkit');


exports.getAllReq = async (req, res) => {
    try {
        if (!applicationLetter || !applicationLetter.findAll) {
            throw new Error("Rooms not found");
        }
        const result = await applicationLetter.findAll();
        res.status(200).json({
            message: "Get All Data",
            data: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

exports.reqLetters = async (req, res) => {
    const { formName, nim, formData } = req.body;
    console.log('Request Body:', req.body);

    //load pdf templates
    const formFilePath = path.join('public', 'templates', 'pengajuan', `${formName}.pdf`);
    if (!fs.existsSync(formFilePath)) {
        return res.status(404).send('PDF template not found');
    }

    try {
        const formPDFBytes = fs.readFileSync(formFilePath);
        const pdfDoc = await PDFDocument.load(formPDFBytes, { ignoreEncryption: true });
        
        pdfDoc.registerFontkit(fontkit);
        const timesRomanFont = fs.readFileSync(path.join('public', 'font', 'Times-New-Roman.otf'));
        const customFont = await pdfDoc.embedFont(timesRomanFont);
        console.log("font:", timesRomanFont);

        const form = pdfDoc.getForm();

        for (const [fieldName, fieldData] of Object.entries(formData)) {
            const formField = form.getTextField(fieldName) || form.getCheckBox(fieldName);
            if (!formField) {
                console.warn(`Field ${fieldName} not found in PDF document`);
                continue;
            }

            switch (fieldData.type) {
                case 'PDFTextField':
                    
                    formField.setText(fieldData.data);
                    formField.updateAppearances(customFont);
                    break;
                case 'PDFCheckBox':
                    if (fieldData.data === 'check') {
                        formField.check();
                    }
                    break;
                default:
                    console.warn(`unsupported field type ${fieldData.type} for field ${fieldName}`);
            }
        }
        
        const filledPdfBytes = await pdfDoc.save();
        
        const outputFilePath = path.join('public', 'application', `${formName}-${nim}.pdf`);
        fs.writeFileSync(outputFilePath, filledPdfBytes);
        console.log("Filled PDF saved to:", outputFilePath);

        //save the filled PDF as a response
        const dataForm = await applicationLetter.create({
            formName: formName,
            nim: nim,
            formData: formData,
            path: outputFilePath
        });

        console.log("data disimpan:", dataForm)
        
        //send the filled PDF as a response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${formName}-${nim}.pdf"`);
        res.send(Buffer.from(filledPdfBytes))
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: error.message });
    }
}

// Route to handle form submission and PDF generation
exports.generatePDF = async (req, res) => {
    const { formName, nim } = req.body;
    try {
        const getFormData = await applicationLetter.findOne({ where: { formName: formName, nim: nim}});
        if (getFormData) {
            console.log("data", getFormData);
            const formName = getFormData.formName;
            const formData = getFormData.formData;
            const formFilePath = path.join('public', 'templates', 'pengajuan', `${formName}.pdf`);
            console.log("filePath: ",formFilePath);
            if (!fs.existsSync(formFilePath)) {
                return res.status(404).send('PDF template not found.');
            }

            const formPdfBytes = fs.readFileSync(formFilePath);
            const pdfDoc = await PDFDocument.load(formPdfBytes, { ignoreEncryption: true });
            const form = pdfDoc.getForm();

            for (const [fieldName, fieldData] of Object.entries(formData)) {
                const formField = form.getTextField(fieldName);
                if (!formField) {
                    console.warn(`Field "${fieldName}" not found in PDF form.`);
                    continue;
                }

                switch (fieldData.type) {
                    case 'PDFTextField':
                        formField.setText(fieldData.data);
                        break;
                    case 'PDFCheckBox':
                        if (fieldData.data === 'check') {
                            formField.check();
                        }
                        break;
                    default:
                        console.warn(`Unsupported field type "${fieldData.type}" for field "${fieldName}".`);
                }
            }

            const filledPdfBytes = await pdfDoc.save();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${formName}-filled.pdf"`);
            res.send(Buffer.from(filledPdfBytes));
        } else {
            res.status(400).json({ error: error.message });
        }
        
    } catch (error) {
        console.error('Error filling PDF form:', error.message);
        res.status(500).send('Error filling PDF form: ' + error.message);
    }
};

exports.AddTemplates = async (req, res) => {
    
}


