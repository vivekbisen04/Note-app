const { MongoClient, ServerApiVersion } = require("mongodb");
const { default: mongoose } = require("mongoose");
const url =
  "mongodb+srv://testUser:testUser123@noteapp.ftzjh.mongodb.net/?retryWrites=true&w=majority&appName=noteApp";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
  })
  .catch((e) => {
    console.log(e);
  });
