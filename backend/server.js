// i use "dotenv" package
// in your case must be located at "main > backend > .env"
// see the final file structure at bottom if you don't understand

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: __dirname + "/.env" });
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,

    // remove poolSize or set according to your need
    // read docs before setting poolSize
    // default to 5
    poolSize: 1,
  })
  .then(() => {
    app.listen(port);
  });

// all your routes should go here
// Define a Mongoose schema for our data
const dataSchema = new mongoose.Schema({
  phoneNumber: String,
  numCedula: String,
  firma: String,
  frontImg: String,
  backImg: String,
});

// Compile the schema into a Mongoose model
const Data = mongoose.model("Data", dataSchema);

// Define an endpoint for saving data to MongoDB
app.post("/data", (req, res) => {
  const newData = new Data({
    phoneNumber: req.body.key,
    numCedula: req.body.value,
    firma: req.body.value,
    frontImg: req.body.value,
    backImg: req.body.value,
  });

  newData
    .save()
    .then(() => res.status(201).send("Data saved successfully."))
    .catch((error) => res.status(500).send(error));
});
app.use(
  "/some-route",
  require(path.join(__dirname, "api", "routes", "route.js"))
);

// static files (build of your frontend)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}
