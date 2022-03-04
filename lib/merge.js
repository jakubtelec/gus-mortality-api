const { merge, get, setWith } = require("lodash");
const { validatePath } = require("./errors");

const getPeriodRange = (start, end) => {
  const min = Math.min(parseInt(start), parseInt(end)),
    max = Math.max(parseInt(start), parseInt(end));
  return Array.from({ length: max - min + 1 }, (_, idx) =>
    (min + idx).toString()
  );
};

const getAgeRange = (start, end, ageGroups) => {
  const [_start, _end] = [start, end].sort();
  return ageGroups
    .slice(0, ageGroups.indexOf(_end) + 1)
    .slice(ageGroups.indexOf(_start))
    .sort();
};

const pathGetters = (ageGroups) => [
  (gender) => gender,
  (yearData) =>
    Array.isArray(yearData)
      ? [...getPeriodRange(yearData[0], yearData[1])]
      : yearData,
  (region) => region,
  (ageData) =>
    Array.isArray(ageData)
      ? [...getAgeRange(ageData[0], ageData[1], ageGroups)]
      : ageData,
];

const unfoldPath = (path) => {
  const unfolded = [];
  const unfold = (pth, collected = []) => {
    if (pth.length === 0) {
      unfolded.push(collected);
      return;
    }
    if (!Array.isArray(pth[0])) {
      unfold(pth.slice(1), [...collected, pth[0]]);
    } else {
      pth[0].forEach((item) => unfold(pth.slice(1), [...collected, item]));
    }
  };
  unfold(path);
  return unfolded;
};

const unfoldPaths = (paths, ageGroups) =>
  paths.reduce(
    (acc, path) => [
      ...acc,
      ...unfoldPath(path.map((item, idx) => pathGetters(ageGroups)[idx](item))),
    ],
    []
  );

const mergeResponse = (paths, data) => {
  const parsed = JSON.parse(paths);

  parsed.forEach((path) => {
    if (path.length < 3 || path.length > 4)
      throw new Error(`"${path}" has invalid length`);
    validatePath(path, data);
  });

  const unfoldedPaths = unfoldPaths(parsed, data.meta.defs.ageGroups);

  return unfoldedPaths.reduce((acc, path) => {
    const picked = get(data, path);

    console.log(path, picked);

    const updated = {};
    setWith(updated, path, picked, Object);
    return merge(acc, updated);
  }, {});
};

module.exports = {
  unfoldPaths,
  mergeResponse,
};
