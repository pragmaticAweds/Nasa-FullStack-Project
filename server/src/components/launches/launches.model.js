const planetsMongo = require("../planets/planets.mongo");
const launchModel = require("./launches.mongo");

const launches = new Map();

const DEFAULT_LAUNCH_NO = 100;

const launch = {
  flightNumber: 100,
  mission: "kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["NASA", "ZTM"],
  upcoming: true,
  success: true,
};

// let latestFlightNumber = 100;

// saveLaunch(launch);

launches.set(launch.flightNumber, launch);

async function launchesData() {
  return await launchModel.find({}, { _id: 0, __v: 0 });
}

async function getLatestFlightNumber() {
  const lastFlight = await launchModel.findOne().sort("-flightNumber");

  if (!lastFlight) {
    return DEFAULT_LAUNCH_NO;
  }

  return lastFlight.flightNumber;
}

async function checkLaunchId(launchId) {
  return await launchModel.findOne({
    flightNumber: launchId,
  });
}

async function saveLaunch(launch) {
  const planet = await planetsMongo.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet found!");
  }

  await launchModel.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero To Mastery", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = launchModel.updateOne(
    { flightNumber: launchId },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted;
}

module.exports = {
  launches,
  launchesData,
  scheduleNewLaunch,
  checkLaunchId,
  abortLaunchById,
};
