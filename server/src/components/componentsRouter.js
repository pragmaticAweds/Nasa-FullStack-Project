const express = require("express");
const appRouter = express.Router();

const planetRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

appRouter.use("/planets", planetRouter);
appRouter.use("/launches", launchesRouter);

module.exports = appRouter;
