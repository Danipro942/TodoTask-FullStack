require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const authRouter = require("./router/auth");
const taskRouter = require("./router/task");
const { errorHandler } = require("./middleware/errorHandler");

const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*", // Puedes restringir a un dominio específico aquí
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", authRouter);
app.use("/api/task", taskRouter);
app.use(errorHandler);

mongoose
  .connect(
    `mongodb://${process.env.MONGO_KEY}@apirestp-shard-00-00.f0mla.mongodb.net:27017,apirestp-shard-00-01.f0mla.mongodb.net:27017,apirestp-shard-00-02.f0mla.mongodb.net:27017/todo?ssl=true&replicaSet=atlas-50f6oe-shard-0&authSource=admin&retryWrites=true&w=majority&appName=ApiRestP`
  )
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Sever Open on http://localhost:${PORT}/`);
    });
  })
  .catch((error) => {
    console.log("Something went wrong ", error);
  });
