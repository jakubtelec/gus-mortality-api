# GUS Mortality API

Simple API providing weekly mortality rates aggregated by [GUS](https://stat.gov.pl/) - used by [GUS Browser app](https://github.com/jakubtelec/gus-browser) frontend.

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

- `/data` - GET request returns JSON object containing mortality data for given paths.

  ### Request:

  Accepts `paths` param containing array of path arrays. Single path array contains: [**gender, year/years range, region, age group/age groups range**]:

  - **gender** : _string_, accepted values: `"general"`, `"males"`, `"females"`
  - **year** : _string_, accepted values: stored in `defs.years` (see `/settings` entry below), e.g. `"2010"`, `"2020"`
  - **years range** : [from: _string_,to: _string_], accepted values - **year** values, e.g. `["2010","2012"]`
  - **region** : _string_, accepted values: keys stored in `defs.years` (see `/settings` entry below), e.g `"Miasto Warszawa"`, `"Polska"`
  - **age group** : _string_, accpeted values: stored in `defs.ageGroups` (see `/settings` entry below), e.g `"0 - 4"`, `"Ogółem"`, `"90 i więcej"`
  - **age groups range** : [from: _string_,to: _string_], accepted values - **age group** values, e.g. `["0 - 4","20 - 24"]`

  General rules:

  - **current requests rate limit for `/data/` entry is 45 requests/minute**
  - partial paths are accepted, but inimum length: 3 (e.g. path `["general","2010","Polska"]` is valid)
  - reversing years order and age groups order is accepted (e.g. path `["general",["2012","2010"],"Polska"]` is valid)
  - API detects wrong names (e.g. `"0 -4 "` instead of `"0 - 4"` in age ranges) and throws error with basic information about its cause.

  Example request with async JS `fetch`:

  ```js
  const paths = JSON.stringify([
    ["general", "2010", "Polska", ["0 - 4", "10 - 14"]],
    ["females", ["2010", "2012"], "Miasto Warszawa", "0 - 4"],
    ["females", ["2000", "2003"], "Miasto Kraków", ["20 - 24", "25 - 29"]],
  ]);

  const response = await (
    await fetch(
      "https://gus-mortality-api.herokuapp.com/data?" +
        new URLSearchParams({ paths })
    )
  ).json();
  ```

  ### Response:

  **Important**: API uses deep merge to stitch picked data into **single response object**.

  Response structure: `{[genders][years][regions][age groups]}`

  Response from example request above:

  ```json
  {
    "general": {
      "2010": {
        "Polska": {
          "0 - 4": [
            /** array of weekly deaths number**/
          ],
          "10 - 14": [
            /** array of weekly deaths number**/
          ],
          "5 - 9": [
            /** array of weekly deaths number**/
          ]
        }
      }
    },
    "females": {
      "2000": {
        "Miasto Kraków": {
          "20 - 24": [
            /** array of weekly deaths number**/
          ],
          "25 - 29": [
            /** array of weekly deaths number**/
          ]
        }
      },
      "2001": {
        "Miasto Kraków": {
          "20 - 24": [
            /** array of weekly deaths number**/
          ],
          "25 - 29": [
            /** array of weekly deaths number**/
          ]
        }
      },
      "2002": {
        "Miasto Kraków": {
          "20 - 24": [
            /** array of weekly deaths number**/
          ],
          "25 - 29": [
            /** array of weekly deaths number**/
          ]
        }
      },
      "2003": {
        "Miasto Kraków": {
          "20 - 24": [
            /** array of weekly deaths number**/
          ],
          "25 - 29": [
            /** array of weekly deaths number**/
          ]
        }
      },
      "2010": {
        "Miasto Warszawa": {
          "0 - 4": [
            /** array of weekly deaths number**/
          ]
        }
      },
      "2011": {
        "Miasto Warszawa": {
          "0 - 4": [
            /** array of weekly deaths number**/
          ]
        }
      },
      "2012": {
        "Miasto Warszawa": {
          "0 - 4": [
            /** array of weekly deaths number**/
          ]
        }
      }
    }
  }
  ```

## Scripts:

- `dev` - runs api locally - on port `4004`
- `test` - runs tests
- `grab-data` - grabs excel spreadsheets from GUS page
- `update` - extracts data to json file ```

## Stack used:

- [Express](https://github.com/expressjs/express)
- [SheetJS](https://github.com/SheetJS/sheetjs)
- [Lodash](https://lodash.com/)
- [Jest](https://github.com/facebook/jest)
