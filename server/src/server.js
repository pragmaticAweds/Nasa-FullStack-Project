const { createServer } = require("http");

const app = require("./app");

const { loadPlanetsData } = require("./components/planets/planets.model");

const server = createServer(app);

const PORT = process.env.PORT || 8000;

async function startServer() {
  await loadPlanetsData();

  server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

startServer();
