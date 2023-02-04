const request = require("supertest");
const app = require("../../app");

describe("Test Get Launches", () => {
  test("It should respond with 200", () => {
    const response = request(app).get("/launches");
    expect(response).toBe(200);
  });
});

describe("Test Post Launches", () => {
  test("It should resppond with 201 success", () => {});
  test("It should catch missing required property", () => {});
  test("It should catch invalid dates", () => {});
});
