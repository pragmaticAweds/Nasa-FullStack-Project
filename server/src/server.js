const { createServer } = require("http");

const app = require("./app");

const mongoose = require("mongoose");

const { loadPlanetsData } = require("./components/planets/planets.model");

const server = createServer(app);

const PORT = process.env.PORT || 8000;

const MONGO_URL =
  "mongodb+srv://nasa-api:aweds@nasa-cluster.axrudls.mongodb.net/nasa?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => console.error(err));
mongoose.set("strictQuery", false);

async function startServer() {
  await mongoose.connect(MONGO_URL);

  await loadPlanetsData();

  server.listen(PORT, () => console.log(`Server is runing on port ${PORT}`));
}

startServer();
