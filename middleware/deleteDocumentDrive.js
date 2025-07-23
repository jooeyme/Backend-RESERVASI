const { google } = require('googleapis');
const drive = google.drive('v3');
const driveService = require('../config/googledrive');

// Fungsi untuk mengekstrak fileId dari URL
function extractFileId(driveUrl) {
    const match = driveUrl.match(/\/d\/(.*?)(\/|$)/) || driveUrl.match(/id=([^&]+)/);
    return match ? match[1] : null;
}

// Fungsi untuk menghapus file dari Google Drive
const deleteFileFromDrive = async(fileUrl) => {
    const fileId = extractFileId(fileUrl);
    if (!fileId) {
        console.error("File ID tidak ditemukan dalam URL.");
        return;
    }

    try {
        await driveService.files.delete({ fileId });
    } catch (error) {
        console.error("Error saat menghapus file:", error.message);
    }
}


module.exports = deleteFileFromDrive;
