require("dotenv").config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const fs = require('fs');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmailWithPdf = async (emails, subject, text, pdfPath) => {
    //try {
        //const { emails, subject, text } = req.body;
        //const pdfBuffer = req.file.buffer;

        const accessTokenResponse = await oAuth2Client.getAccessToken();
        const accessToken = accessTokenResponse.token;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'mtejo25@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const pdfBuffer = fs.readFileSync(pdfPath);

        const mailOptions = {
            from: 'mtejo25@gmail.com',
            to: emails,
            subject: subject,
            text: text,
            attachments: [
                {
                    filename: `document.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                },
            ],
        };

        return await transporter.sendMail(mailOptions);
        //const result = await transporter.sendMail(mailOptions);
        //res.status(200).send('Email sent: ' + result.response);
    //} catch (error) {
    //    res.status(500).send(error.toString());
    //}
};

module.exports = { sendEmailWithPdf };
