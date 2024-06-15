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

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
//app.use(fileUpload());
app.use('/public/uploads', express.static('public/uploads'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




//store.sync();

app.use("/api", routes);

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/api`);
  });
