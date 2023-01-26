const express = require("express");

const planetsRouter = express.Router();

const { getAllPlanets } = require("./planets.controller");

planetsRouter.get("/", getAllPlanets);

module.exports = planetsRouter;
