const { planetsData } = require("./planets.model");

function getAllPlanets(req, res) {
  return res.status(200).json(planetsData());
}

module.exports = {
  getAllPlanets,
};

console.log(planetsData());
