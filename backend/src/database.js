const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const URI = process.env.MONGODB_URI;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Connected to MongoDB");
});
