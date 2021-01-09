const { mergeResponse } = require("../lib/merge.js");
const data = require("../json/data.json");

const notEmpty = (arr) => arr.length > 0;
const hasKeys = (obj, keys) => Object.keys(obj).join() === keys.join();

const cases = {
  "Simple case - no ranges": {
    input: [["general", "2010", "Miasto Warszawa", "Ogółem"]],
    checkers: [
      (merged) => notEmpty(merged.general["2010"]["Miasto Warszawa"]["Ogółem"]),
    ],
  },
  "Simple case - partial path": {
    input: [["general", "2010", "Miasto Warszawa"]],
    checkers: [
      (merged) => notEmpty(merged.general["2010"]["Miasto Warszawa"]["Ogółem"]),
      (merged) =>
        hasKeys(
          merged.general["2010"]["Miasto Warszawa"],
          data.meta.defs.ageGroups
        ),
    ],
  },
  "Simple case - genders": {
    input: [
      ["general", "2010", "Miasto Warszawa", "Ogółem"],
      ["males", "2010", "Miasto Warszawa", "Ogółem"],
    ],
    checkers: [
      (merged) => hasKeys(merged, ["general", "males"]),
      (merged) => notEmpty(merged.general["2010"]["Miasto Warszawa"]["Ogółem"]),
      (merged) => notEmpty(merged.males["2010"]["Miasto Warszawa"]["Ogółem"]),
    ],
  },
  "Simple case - merge regions": {
    input: [
      ["general", "2010", "Miasto Warszawa", "Ogółem"],
      ["general", "2010", "Miasto Kraków", "Ogółem"],
    ],
    checkers: [
      (merged) =>
        hasKeys(merged.general["2010"], ["Miasto Warszawa", "Miasto Kraków"]),
    ],
  },
  "Simple case - period range": {
    input: [["general", ["2010", "2012"], "Miasto Warszawa", "Ogółem"]],
    checkers: [
      (merged) => notEmpty(merged.general["2010"]["Miasto Warszawa"]["Ogółem"]),
      (merged) => hasKeys(merged.general, ["2010", "2011", "2012"]),
    ],
  },
  "Simple case - age range": {
    input: [["general", "2010", "Miasto Warszawa", ["35 - 39", "55 - 59"]]],
    checkers: [
      (merged) =>
        hasKeys(merged.general["2010"]["Miasto Warszawa"], [
          "35 - 39",
          "40 - 44",
          "45 - 49",
          "50 - 54",
          "55 - 59",
        ]),
    ],
  },
};

Object.entries(cases).forEach(([label, { input, checkers }]) => {
  test(label, () => {
    const merged = mergeResponse(JSON.stringify(input), data);
    checkers.forEach((checker) => expect(checker(merged)).toBe(true));
  });
});

test("Error handling", () => {
  expect(() =>
    mergeResponse(JSON.stringify([["general", "2010"]]), data)
  ).toThrowError(/has invalid length/);
  expect(() =>
    mergeResponse(JSON.stringify([["generl", "2010", "Miasto Warszawa"]]), data)
  ).toThrowError(/gender/);
  expect(() =>
    mergeResponse(
      JSON.stringify([["general", "2030", "Miasto Warszawa"]]),
      data
    )
  ).toThrowError(/year/);
  expect(() =>
    mergeResponse(JSON.stringify([["general", "2020", "Warszawa"]]), data)
  ).toThrowError(/region/);
});
