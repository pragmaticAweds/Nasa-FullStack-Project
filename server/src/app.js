const express = require("express");

const { join } = require("path");

const app = express();
const cors = require("cors");
const morgan = require("morgan");

const appRouter = require("./components/componentsRouter");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));

app.use(express.json());
app.use(express.static(join(__dirname, "..", "public")));

app.use("/v1", appRouter);

app.get("/*", (req, res) => {
  res.sendFile(join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
