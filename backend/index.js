const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoute = require("./src/routes/users.route");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use("/api", userRoute);

// routes

app.get("/", (req, res) => {
  res.send("welcome to my api");
});

// mongoose mongoDB
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Conneted to MongoDB");
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
