const { createServer } = require("http");

require("dotenv").config();

const app = require("./app");

const { connectDB } = require("./services/db");

const { loadPlanetsData } = require("./components/planets/planets.model");
const { loadLaunchData } = require("./components/launches/launches.model");

const server = createServer(app);

const PORT = process.env.PORT;

async function startServer() {
  await connectDB();
  await loadPlanetsData();
  await loadLaunchData();

  server.listen(PORT, () => console.log(`Server is runing on port ${PORT}`));
}

startServer();
