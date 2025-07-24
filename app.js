require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const db = require('./models/index.js');

console.log('FRONTEND_URL from process.env:', process.env.FRONTEND_URL);
console.log('--- END RAILWAY ENV DEBUGGING ---');


app.use(express.json());
app.use(morgan("dev"));
// app.use(cors());
// app.use(cors({
//        origin: process.env.FRONTEND_URL,
//        credentials: true,
// }));
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigin = process.env.FRONTEND_URL; // Ambil nilai yang diharapkan
        console.log(`CORS Check: Request Origin is: '${origin}'`);
        console.log(`CORS Check: Allowed Origin from ENV is: '${allowedOrigin}'`);

        if (!origin || origin === allowedOrigin) {
            callback(null, true);
        } else {
            console.error(`CORS BLOCKED: Mismatch! Request: '${origin}', Expected: '${allowedOrigin}'`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




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




