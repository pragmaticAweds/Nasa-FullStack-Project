//Using the createReadStream function from filesystem node module to read the csv file
const { createReadStream } = require("fs");
const { join } = require("path");

const { parse } = require("csv-parse");

const Planet = require("./planets.mongo");

// habitablePlanet variable to store our data
// const habitablePlanet = [];

//

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    createReadStream(
      join(__dirname, "..", "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )

      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await savePlanet(data);
        }
      })

      .on("error", (err) => {
        console.log(err);
        reject(err);
      })

      .on("end", async () => {
        const countPlanetsData = (await planetsData()).length;
        console.log(`${countPlanetsData} habitable planets found!`);
        resolve();
      });
  });
}

async function savePlanet(planet) {
  try {
    await Planet.updateOne(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true }
    );
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
}

async function planetsData() {
  return await Planet.find({});
}

module.exports = {
  loadPlanetsData,
  planetsData,
};
