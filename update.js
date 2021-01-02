const XLSX = require("xlsx");
const fs = require("fs");

const { sheet_to_json } = XLSX.utils;
const { keys, values } = Object;

const pickFirst = (obj) => values(obj)[0];

const DATA_DIR = "./xlsx";
const OUTPUT_DIR = "./json";

const files = fs
  .readdirSync(DATA_DIR)
  .filter((fileName) => fileName.includes("xlsx"))
  .sort();

const data = {},
  regions = {};

for (let fileName of files) {
  const year = fileName.split("_")[1].split(".")[0];

  console.time(`Reading data for ${year}`);
  const workbook = XLSX.readFile(DATA_DIR + "/" + fileName);

  ["general", "males", "females"].forEach((keyName, sheetidx) => {
    const yearData = {};

    if (!data[keyName]) {
      data[keyName] = { [year]: yearData };
    } else {
      data[keyName][year] = yearData;
    }
    const rawData = sheet_to_json(values(workbook.Sheets)[sheetidx]);
    for (const row of rawData.slice(6)) {
      const [age, code, name, ...byWeek] = values(row);
      if (!yearData[name]) yearData[name] = { [age]: {} };
      regions[name] = code;
      yearData[name][age] = byWeek;
    }
  });
  console.timeEnd(`Reading data for ${year}`);
}

const metaPick = data.general;

const years = keys(metaPick);

const ageGroups = keys(pickFirst(pickFirst(metaPick)));

data.meta = { defs: { years, regions, ageGroups } };

fs.writeFileSync(OUTPUT_DIR + "/" + `data.json`, JSON.stringify(data));
