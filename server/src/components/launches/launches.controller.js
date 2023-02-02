const {
  launchesData,
  addLaunch,
  checkLaunchId,
  abortLaunchById,
} = require("./launches.model");

function getAllLaunches(req, res) {
  return res.status(200).json(launchesData());
}

function createNewLaunch(req, res) {
  let launch = req.body;

  //validate if fields are not empty

  if (!launch.mission || !launch.rocket || !launch.target || !launch.launchDate)
    return res.status(400).json({
      error: "Missing required field",
    });

  //validate if launch date is a date type Method 1
  launch.launchDate = new Date(launch.launchDate);
  //   if (launch.launchDate.toString() === "Invalid Date")
  //     return res.status(400).json({ error: "Invalid launch date" });

  //Method 2 to valid date type
  if (isNaN(launch.launchDate))
    return res.status(400).json({ error: "Invalid launch date" });

  addLaunch(launch);

  return res.status(201).json(launch);
}

function deleteLaunch(req, res) {
  const launchId = Number(req.params.id);

  if (!checkLaunchId(launchId))
    return res.status(404).json({ error: "Launch not found" });

  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
  getAllLaunches,
  createNewLaunch,
  deleteLaunch,
};
