# gt-optical-tha

## How to run the app
1. In your desired directory, open a terminal and clone this directory using `git clone https://github.com/skyl3-r/gt-optical-tha.git`
2. Cd into the directory `gt-optical-tha` and open a terminal.
3. Install dependencies with `npm i`.
4. Run the app with `node app.js`.

## Feature 1: Get list of users
How to use: 
1. In your browser, open http://localhost:3000/users?min=&max=&offset=&limit=&sort=.
2. Write value of the param after its `=`. If a param is left out or left empty, its default value will be used.

Examples: 
- To not use any params, use url http://localhost:3000/users
- To have min of 100.5, use url http://localhost:3000/users?min=100.5

Params:
- min: type is float, default value is 0.0
- max: type is float, default value is 4000.0
- offset: type is int, default value is 0
- limit: type is int, default value is null
- sort: type is string, default value is null

## Feature 2: Update list of users
How to use:
1. Open command terminal in the directory `gt-optical-tha`.
2. Use command `curl.exe -X POST http://localhost:3000/upload -F "file=@testUploads/validTest.csv"`. The file `validTest.csv` can be replaced with any other file in the folder `testUploads`.
3. You can create your own csv files in the `testUploads` folder if so desired :D, a template can be found in `forReference/templateTest.csv`.
4. Go to http://localhost:3000/users to see the updated list. The initial seeding data can be found in `forReference/startingData.csv`.

Test csvs:
- `validTest.csv`: includes rows with new and currently present names, as well as rows with negative and 0 salary; `{"success":1}` should be returned.
- `wrongTest1.csv`: includes valid rows and a row with an extra column; `{"success":0,"error":"Row length does not match headers"}` should be returned.
- `wrongTest2.csv`: includes valid rows and a row with non numeric salary; `{"success":0,"error":"Salary number cannot be parsed"}` should be returned.

## Dependencies
- express
- csv-parser
- multer
- csv-stringify

## Guides used
- For express routing: https://expressjs.com/en/guide/routing.html
- For reading csv files: https://blog.logrocket.com/complete-guide-csv-files-node-js/
- For updating csv files: https://blog.shahednasser.com/how-to-read-and-write-csv-files-using-node-js-and-express/
