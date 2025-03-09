# gt-optical-tha

## How to run the app
1. Install dependencies `npm i`
2. Run `node app.js`
3. Open url http://localhost:3000/users

## Feature1: Get list of users
How to use: 
1. In browser, open http://localhost:3000/users?min=&max=&offset=&limit=&sort=
2. Write value of the param after its `=`. If param is left out or empty, its default value will be used.

Examples: 
- To not use any params, use url http://localhost:3000/users
- To have min of 100.5, use url http://localhost:3000/users?min=100.5

Params:
- min: type is float, default value is 0.0
- max: type is float, default value is 4000.0
- offset: type is int, default value is 0
- limit: type is int, default value is null
- sort: type is string, default value is null

## Feature2: Update list of users
How to use:
1. Open command terminal in the current directory `\gt-optical-tha`.
2. Use command `curl.exe -X POST http://localhost:3000/upload -F "file=@testUploads/test1.csv"`. The file `test1.csv` can be replaced with any other file in the folder `testUploads`.

## Dependencies
- express
- csv-parser
- multer

## Guides used
- For express routing: https://expressjs.com/en/guide/routing.html
- For reading csv file: https://blog.logrocket.com/complete-guide-csv-files-node-js/