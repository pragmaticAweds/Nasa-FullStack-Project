const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: "kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "kepler-442 b",
  customers: ["NASA", "ZTM"],
  upcoming: true,
  success: true,
};

let latestFlightNumber = 100;

launches.set(launch.flightNumber, launch);

function launchesData() {
  return Array.from(launches.values());
}

function checkLaunchId(launchId) {
  return launches.has(launchId);
}

function addLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ["ZTM", "NASA"],
      flightNumber: latestFlightNumber,
    })
  );
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  launches,
  launchesData,
  addLaunch,
  checkLaunchId,
  abortLaunchById,
};
