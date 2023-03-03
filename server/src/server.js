const { createServer } = require("http");

const app = require("./app");

const { connectDB } = require("./services/db");

const { loadPlanetsData } = require("./components/planets/planets.model");
const { loadLaunchData } = require("./components/launches/launches.model");

const server = createServer(app);

const PORT = process.env.PORT || 8000;

async function startServer() {
  await connectDB();
  await loadPlanetsData();
  await loadLaunchData();

  server.listen(PORT, () => console.log(`Server is runing on port ${PORT}`));
}

startServer();
