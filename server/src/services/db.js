const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://nasa-api:aweds@nasa-cluster.axrudls.mongodb.net/nasa?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => console.error(err));
mongoose.set("strictQuery", false);

async function connectDB() {
  await mongoose.connect(MONGO_URL);
}

async function closeDB() {
  await mongoose.disconnect();
}

module.exports = { connectDB, closeDB };
