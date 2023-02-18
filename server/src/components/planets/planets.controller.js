const { planetsData } = require("./planets.model");

async function getAllPlanets(req, res) {
  return res.status(200).json(await planetsData());
}

module.exports = {
  getAllPlanets,
};

// console.log(planetsData());
