const request = require("supertest");
const app = require("../../app");
const { connectDB, closeDB } = require("../../services/db");

describe("Launches APIs", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  describe("Test Get Launches", () => {
    test("It should respond with 200", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-type", /json/)
        .expect(200);
    });
  });

  describe("Test Post Launches", () => {
    const newLaunch = {
      mission: "Launch EnterPrise",
      rocket: "NCC-101",
      target: "Kepler-62 f",
      launchDate: "January 4, 2028",
    };

    const newLaunchWithNoDate = {
      mission: "Launch EnterPrise",
      rocket: "NCC-101",
      target: "Kepler-62 f",
    };

    const newLaunchWithInvalid = {
      mission: "Launch EnterPrise",
      rocket: "NCC-101",
      target: "Kepler-62 f",
      launchDate: "hello",
    };

    test("It should respond with 201 success", async () => {
      const res = await request(app)
        .post("/v1/launches")
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
        .post("/v1/launches")
        .expect("Content-type", /json/)
        .send(newLaunchWithNoDate)
        .expect(400);

      expect(res.body).toStrictEqual({
        error: "Missing required field",
      });
    });
    test("It should catch invalid dates", async () => {
      const res = await request(app)
        .post("/v1/launches")
        .expect("Content-type", /json/)
        .send(newLaunchWithInvalid)
        .expect(400);

      expect(res.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
