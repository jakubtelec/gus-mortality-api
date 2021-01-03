# GUS Mortality API

Simple API providing jsonized weekly mortality rates aggregated by [GUS](https://stat.gov.pl/) - used by [GUS Browser app](https://github.com/jakubtelec/gus-browser) frontend.

## API description:

BASE URL:

```
https://gus-mortality-api.herokuapp.com/
```

### Entries:

- `/settings` - GET request returns JSON object with general data defs:

  ```js
  {
   defs: {
       years: ["year #1 name", ...],
       ageGroups: ["age group #1 name", "age group #2 name", ...],
       regions: { "region #1 name" : "region #1 code", ...},
       }
  }
  ```

- `/data` - GET requests returns JSON object containing mortality data for given genders and years. Accepts array of path strings - one path string contains gender category (`"general"`, `"males"`, `"females"`) and year separated with dot.

  Example request with JS `fetch`:

  ```js
  const paths = JSON.stringify(["general.2010", "males.2010", "females.2010"]);

  const response = await (
    await fetch(
      "https://gus-mortality-api.herokuapp.com/data?" +
        new URLSearchParams({ paths })
    )
  ).json();
  ```

  returns:

  ```js
  {
      general: { 2010: { "region #1 name": { "age group #1 name": [ week #1 deaths, week #2 deaths ..    .], ... }, ...}},
      males: { 2010: { ... } },
      females: { 2010: { ... }}
  }

  ```

  (one `gender-year` chunk size is ~260KB)

## Stack:

- [Express](https://github.com/expressjs/express)
- [SheetJS](https://github.com/SheetJS/sheetjs)

## Scripts:

- `grab-data` - grabs excel spreadsheets from GUS page
- `update` - extracts data to json file
- `dev` - runs api locally - on port `4004`
