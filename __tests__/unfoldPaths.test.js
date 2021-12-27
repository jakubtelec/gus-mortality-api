const { unfoldPaths } = require("../lib/merge.js");
const ageGroups = require("../json/data.json").meta.defs.ageGroups;

const cases = {
  "Simple case - no ranges": {
    input: [["general", "2010", "Warszawa", "Ogółem"]],
    expected: [["general", "2010", "Warszawa", "Ogółem"]],
  },
  "Simple case - partial": {
    input: [["general", "2010", "Warszawa"]],
    expected: [["general", "2010", "Warszawa"]],
  },
  "Simple case - period range": {
    input: [["general", ["2010", "2012"], "Warszawa", "Ogółem"]],
    expected: [
      ["general", "2010", "Warszawa", "Ogółem"],
      ["general", "2011", "Warszawa", "Ogółem"],
      ["general", "2012", "Warszawa", "Ogółem"],
    ],
  },
  "Simple case - age range": {
    input: [["general", "2010", "Warszawa", ["35 - 39", "55 - 59"]]],
    expected: [
      ["general", "2010", "Warszawa", "35 - 39"],
      ["general", "2010", "Warszawa", "40 - 44"],
      ["general", "2010", "Warszawa", "45 - 49"],
      ["general", "2010", "Warszawa", "50 - 54"],
      ["general", "2010", "Warszawa", "55 - 59"],
    ],
  },
  "Simple case - age range reversed": {
    input: [["general", "2010", "Warszawa", ["55 - 59", "35 - 39"]]],
    expected: [
      ["general", "2010", "Warszawa", "35 - 39"],
      ["general", "2010", "Warszawa", "40 - 44"],
      ["general", "2010", "Warszawa", "45 - 49"],
      ["general", "2010", "Warszawa", "50 - 54"],
      ["general", "2010", "Warszawa", "55 - 59"],
    ],
  },
  "Mixed case - no ranges + period range": {
    input: [
      ["general", ["2010", "2012"], "Warszawa", "Ogółem"],
      ["males", "2010", "Polska", "0 - 4"],
    ],
    expected: [
      ["general", "2010", "Warszawa", "Ogółem"],
      ["general", "2011", "Warszawa", "Ogółem"],
      ["general", "2012", "Warszawa", "Ogółem"],
      ["males", "2010", "Polska", "0 - 4"],
    ],
  },
  "Mixed case - combine period range + age range": {
    input: [["general", ["2010", "2011"], "Warszawa", ["35 - 39", "45 - 49"]]],
    expected: [
      ["general", "2010", "Warszawa", "35 - 39"],
      ["general", "2010", "Warszawa", "40 - 44"],
      ["general", "2010", "Warszawa", "45 - 49"],
      ["general", "2011", "Warszawa", "35 - 39"],
      ["general", "2011", "Warszawa", "40 - 44"],
      ["general", "2011", "Warszawa", "45 - 49"],
    ],
  },
};

Object.entries(cases).forEach(([label, { input, expected }]) => {
  test(label, () => {
    const res = unfoldPaths(input, ageGroups);
    expect(res).toEqual(expected);
  });
});
