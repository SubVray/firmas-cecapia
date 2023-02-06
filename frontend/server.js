const uri = process.env.MONGODB_URI || 5000;
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Parse the incoming request body as JSON
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to MongoDB."))
  .catch((error) => console.error(error));

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

// Start the server
app.listen(5000, () => console.log("Server listening on port 5000."));
