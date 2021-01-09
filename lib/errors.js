const pathValidators = (defs) => [
  {
    validator: (gender) => ["general", "males", "females"].includes(gender),
    error: (gender) => `Invalid gender name: "${gender}"`,
  },
  {
    validator: (year) =>
      (Array.isArray(year) ? year : [year]).every((yr) =>
        defs.years.includes(yr)
      ),
    error: (year) => `Invalid year name: "${year}"`,
  },

  {
    validator: (region) => Object.keys(defs.regions).includes(region),
    error: (region) => `Invalid region name: "${region}"`,
  },
  {
    validator: (ageGroup) =>
      (Array.isArray(ageGroup) ? ageGroup : [ageGroup]).every((group) =>
        defs.ageGroups.includes(group)
      ),
    error: (ageGroup) => `Invalid age group name: "${ageGroup}"`,
  },
];

const validatePath = (path, data) =>
  path.forEach((item, idx) => {
    if (!pathValidators(data.meta.defs)[idx].validator(item))
      throw new Error(pathValidators(data.meta.defs)[idx].error(item));
  });

module.exports = {
  validatePath,
};
