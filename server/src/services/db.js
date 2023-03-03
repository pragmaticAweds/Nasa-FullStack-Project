require("dotenv").config();

const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;

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
