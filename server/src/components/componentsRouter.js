const express = require("express");
const appRouter = express.Router();

const planetRouter = require("./planets/planets.router");

appRouter.use("/planets", planetRouter);

module.exports = appRouter;
