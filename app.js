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
app.use(cors());
// app.use(cors({
//        origin: process.env.FRONTEND_URL
// }));


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




//store.sync();

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/api`);
});

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

