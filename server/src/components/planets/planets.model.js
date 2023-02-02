//Using the createReadStream function from filesystem node module to read the csv file
const { createReadStream } = require("fs");
const { join } = require("path");

const { parse } = require("csv-parse");

// habitablePlanet variable to store our data
const habitablePlanet = [];

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

      .on("data", (chunk) => {
        if (isHabitablePlanet(chunk)) {
          habitablePlanet.push(chunk);
        }
      })

      .on("error", (err) => {
        console.log(err);
        reject(err);
      })

      .on("end", () => {
        resolve();
      });
  });
}

function planetsData() {
  return habitablePlanet;
}

module.exports = {
  loadPlanetsData,
  planetsData,
};
