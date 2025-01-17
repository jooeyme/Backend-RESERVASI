require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const path = require("path");
//const fileUpload = require('express-fileupload');
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const db = require('./models/index.js');

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin: process.env.FRONTEND_URL
}));


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




//store.sync();

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/api`);
});

  async function listFormFields(pdfPath) {
    try {
        const pdfBuffer = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const form = pdfDoc.getForm();

        const fields = form.getFields();
        fields.forEach(field => {
            const type = field.constructor.name;
            const name = field.getName();
            console.log(`${type}: ${name}`);
        });
    } catch (error) {
        console.error('Error listing form fields:', error);
    }
}
// Test Database Connection
db.sequelize
    .authenticate()
    .then(() => {
        console.log('Database connected successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

const pdfPath = path.join(__dirname, './public/templates/pengajuan/form blanko kolokium.pdf');
//listFormFields(pdfPath);
