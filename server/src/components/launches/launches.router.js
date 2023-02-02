const express = require("express");
const launchesRouter = express.Router();

const {
  getAllLaunches,
  createNewLaunch,
  deleteLaunch,
} = require("./launches.controller");

launchesRouter
  .get("/", getAllLaunches)
  .post("/", createNewLaunch)
  .delete("/:id", deleteLaunch);

module.exports = launchesRouter;
