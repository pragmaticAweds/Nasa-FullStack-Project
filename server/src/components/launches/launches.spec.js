const request = require("supertest");
const app = require("../../app");

describe("Test Get Launches", () => {
  test("It should respond with 200", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-type", /json/)
      .expect(200);
  });
});

describe("Test Post Launches", () => {
  const newLaunch = {
    mission: "Launch EnterPrise",
    rocket: "NCC-101",
    target: "kepler-186 f",
    launchDate: "January 4, 2028",
  };

  const newLaunchWithNoDate = {
    mission: "Launch EnterPrise",
    rocket: "NCC-101",
    target: "kepler-186 f",
  };

  const newLaunchWithInvalid = {
    mission: "Launch EnterPrise",
    rocket: "NCC-101",
    target: "kepler-186 f",
    launchDate: "hello",
  };

  test("It should respond with 201 success", async () => {
    const res = await request(app)
      .post("/launches")
      .expect("Content-type", /json/)
      .send(newLaunch)
      .expect(201);

    const reqDate = new Date(newLaunch.launchDate).valueOf();
    const resDate = new Date(res.body.launchDate).valueOf();

    expect(reqDate).toBe(resDate);
    expect(res.body).toMatchObject(newLaunchWithNoDate);
  });

  test("It should catch missing required property", async () => {
    const res = await request(app)
      .post("/launches")
      .expect("Content-type", /json/)
      .send(newLaunchWithNoDate)
      .expect(400);

    expect(res.body).toStrictEqual({
      error: "Missing required field",
    });
  });
  test("It should catch invalid dates", async () => {
    const res = await request(app)
      .post("/launches")
      .expect("Content-type", /json/)
      .send(newLaunchWithInvalid)
      .expect(400);

    expect(res.body).toStrictEqual({
      error: "Invalid launch date",
    });
  });
});
