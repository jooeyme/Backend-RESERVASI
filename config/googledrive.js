const fs = require("fs");
const { google } = require("googleapis");
require("dotenv").config();
const path = require("path");

const credentialsPath = path.join(__dirname, "temp-gdrive-credential.json");

try {
  fs.writeFileSync(credentialsPath, process.env.GOOGLE_CREDENTIAL);
  // Autentikasi Google Drive API
  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath, // File credentials dari Google Cloud
    scopes: ["https://www.googleapis.com/auth/drive.file"], // Akses untuk unggah file
  });


  const driveService = google.drive({ version: "v3", auth });

  module.exports = driveService;

} catch (error) {
  console.error("Failed to load Google Drive credentials:", error);
  process.exit(1);
}

