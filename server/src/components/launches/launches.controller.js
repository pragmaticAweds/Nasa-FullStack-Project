const {
  launchesData,
  scheduleNewLaunch,
  checkLaunchId,
  abortLaunchById,
} = require("./launches.model");

async function getAllLaunches(req, res) {
  return res.status(200).json(await launchesData());
}

async function createNewLaunch(req, res) {
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

  await scheduleNewLaunch(launch);

  return res.status(201).json(launch);
}

async function deleteLaunch(req, res) {
  const launchId = Number(req.params.id);

  const checkLaunch = await checkLaunchId(launchId);
  if (!checkLaunch) return res.status(404).json({ error: "Launch not found" });

  const aborted = await abortLaunchById(launchId);

  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }
  return res.status(200).json({
    ok: true,
  });
}

module.exports = {
  getAllLaunches,
  createNewLaunch,
  deleteLaunch,
};
