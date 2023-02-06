const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");

const app = express();
app.use(bodyParser.json());

const uri = process.env.MONGODB_URI || 5000;
mongodb.MongoClient.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      console.log(error);
      return;
    }

    const db = client.db("test");
    app.post("/data", (req, res) => {
      db.collection("data").insertOne(req.body, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).send();
          return;
        }

        res.status(201).send();
      });
    });
  }
);

app.listen(5000, () => {
  console.log("Server started");
});
