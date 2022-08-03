const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const knex = require("knex");
const knexConfig = require("./utils/knexfile");
const { Model } = require("objection");
const { verifyToken } = require("./middleware/auth");
const socketio = require("socket.io");
const { ProjectsController } = require("./controllers/ProjectsController");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`) });

const app = express();
const port = process.env.NODE_PORT || 3000;
const host = process.env.NODE_HOST || "0.0.0.0";

const server = app.listen(port, host, () => {
  console.log(`App listening at http://${host}:${port}`);
});

app.use(cors({ origin: process.env.CLIENT_HOST, credentials: true }));

const io = socketio(server, { cors: { origin: process.env.CLIENT_HOST } });

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  io.emit("socketId", socket.id);

  let user;

  socket.on("online", (userId) => {
    console.log("online", userId);
    user = userId;
  });

  socket.on("disconnect", async () => {
    console.log("user", user);
    await ProjectsController.releaseProjectsLocked(user);
    console.log("User disconnected", socket.id);

    socket.disconnect(); // DISCONNECT SOCKET
  });
});

app.use(express.static(__dirname + "public"));
app.use(morgan("dev"));
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_HOST); // update to match the domain you will make the request from
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

// Catch the error and return on client
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send({ error: err.message });
});
