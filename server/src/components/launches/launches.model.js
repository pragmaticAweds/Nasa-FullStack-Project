const axios = require("axios");

const planetsMongo = require("../planets/planets.mongo");
const launchModel = require("./launches.mongo");

const DEFAULT_LAUNCH_NO = 100;

async function launchesData(skip, limit) {
  return await launchModel
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function getLatestFlightNumber() {
  const lastFlight = await launchModel.findOne().sort("-flightNumber");

  if (!lastFlight) {
    return DEFAULT_LAUNCH_NO;
  }

  return lastFlight.flightNumber;
}

async function findLaunch(filter) {
  return await launchModel.findOne(filter);
}

async function checkLaunchId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function saveLaunch(launch) {
  await launchModel.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

const SPACE_X_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateDatabase() {
  console.log("Loading launches data!!!");
  const response = await axios.post(SPACE_X_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  const launchDocs = await response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    console.log(`${launch.flightNumber} ${launch.mission}`);

    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    mission: "FalconSat",
    rocket: "Falcon 1",
  });

  if (firstLaunch) {
    console.log("Launches already loaded");
  } else {
    await populateDatabase();
  }
}

async function scheduleNewLaunch(launch) {
  const planet = await planetsMongo.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet found!");
  }

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
  const aborted = await launchModel.updateOne(
    { flightNumber: launchId },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchData,
  launchesData,
  scheduleNewLaunch,
  checkLaunchId,
  abortLaunchById,
};
