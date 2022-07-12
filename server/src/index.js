const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const knex = require("knex");
const knexConfig = require("./utils/knexfile");
const { Model } = require("objection");
const { verifyToken } = require("./middleware/auth");
require("dotenv").config();

const app = express();
const port = process.env.NODE_PORT || 3000;
const host = process.env.NODE_HOST || "0.0.0.0";

// var corsOption = { origin: "http://localhost:9000" };
// app.use(cors(corsOption));

// app.use(cors({ origin: "http://localhost:9000", credentials: true }));

app.use(express.static(__dirname + "public"));
app.use(morgan("dev"));
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:9000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

const environment = knex(process.env.NODE_ENV === "production" ? knexConfig.production : knexConfig.development);
Model.knex(environment);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/", require("./routes/auth"));
app.use(verifyToken);
app.use("/api/", require("./routes/users"));
app.use("/api/", require("./routes/projects"));
app.use("/api/", require("./routes/comments"));
app.use("/api/", require("./routes/objects"));
app.use("/api/", require("./routes/threeCalculations"));

// app.use("/welcome", verifyToken, (req, res) => {
//   res.send("Welcome");
// })

// Catch the error and print it in console
app.use((err, req, res, next) => {
  console.error(err);
  next(err);
});

// Catch the error and return on client
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ error: err.message });
});

app.listen(port, host, () => {
  console.log(`App listening at http://${host}:${port}`);
});
