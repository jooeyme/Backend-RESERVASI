require("dotenv").config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


const transporter = async (req, res, next) => {
    try {
        const accessTokenResponse = await oAuth2Client.getAccessToken();
        const accessToken = accessTokenResponse?.token;

        if (!accessToken) throw new Error('Failed to get access token.');

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'mtejo25@gmail.com', // Ganti dengan email Anda
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken,
            },
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
        });

        req.transporter = transporter; // Menyimpan transporter ke dalam req
        next(); // Melanjutkan ke middleware atau handler berikutnya
    } catch (error) {
        console.error('Error creating transporter:', error.message);
        res.status(500).json({
            message: 'Failed to initialize email transporter',
            error: error.message,
        });
    }
};

module.exports = {transporter}