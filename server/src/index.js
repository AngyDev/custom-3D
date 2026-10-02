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
const defaultAllowedOrigins = [
  "http://localhost:9000",
  "http://127.0.0.1:9000",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://precise.app:9000",
  "https://precise.app",
];
const allowedOrigins = [...new Set([
  ...defaultAllowedOrigins,
  ...(process.env.CLIENT_HOST || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
])];

const server = app.listen(port, host, () => {
  console.log(`App listening at http://${host}:${port}`);
});

app.use(cors({ origin: allowedOrigins, credentials: true }));

const io = socketio(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);

  io.emit("socketId", socket.id);

  let user;

  socket.on("online", (userId) => {
    console.log("online", userId);
    user = userId;
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected", user);
    if (user) {
      await ProjectsController.releaseProjectsLocked(user);
      console.log("Socket disconnected", socket.id);
    }

    socket.disconnect(); // DISCONNECT SOCKET
  });
});

app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));
app.use(cookieParser());

app.use(function (req, res, next) {
  const requestOrigin = req.headers.origin;
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.header("Access-Control-Allow-Origin", requestOrigin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
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
app.use("/uploads", express.static(path.join(__dirname, "/public/uploads")));
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
