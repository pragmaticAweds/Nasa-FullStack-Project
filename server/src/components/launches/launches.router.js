const express = require("express");
const launchesRouter = express.Router();

const { getAllLaunches } = require("./launches.controller");

launchesRouter.get("/", getAllLaunches);

module.exports = launchesRouter;
