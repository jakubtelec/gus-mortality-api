const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

const LOCAL_PORT = 4004;
const port = process.env.PORT || LOCAL_PORT;

const data = JSON.parse(fs.readFileSync("./json/data.json"));

app.get("/settings", (_, res) => {
  res.json(data.meta);
});

app.get("/data", (req, res) => {
  const { paths } = req.query;
  if (!paths) throw new Error("No paths provided!");
  const ret = JSON.parse(paths).reduce(
    (acc, path) => {
      const [gender, year] = path.split(".");
      if (!data[gender] || !data[gender][year])
        throw new Error(`No data entries for path "${path}"`);
      if (!acc[gender]) acc[gender] = {};
      acc[gender][year] = data[gender][year];
      return acc;
    },

    {}
  );
  res.json(ret);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
