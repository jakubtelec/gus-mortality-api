const fs = require("fs");
const express = require("express");
const { mergeResponse } = require("./lib/merge");
const cors = require("cors");
const app = express();
const rateLimit = require("express-rate-limit");

const LOCAL_PORT = 4004;
const port = process.env.PORT || LOCAL_PORT;

app.use(cors());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 45,
});

app.use("/data", limiter);
const data = JSON.parse(fs.readFileSync("./json/data.json"));

app.get("/settings", (_, res) => {
  res.json(data.meta);
});

app.get("/data", (req, res) => {
  const { paths } = req.query;
  if (!paths) throw new Error("No paths provided!");
  res.json(mergeResponse(paths, data));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
