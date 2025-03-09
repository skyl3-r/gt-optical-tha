# gt-optical-tha

## How to run the app
1. Install dependencies `npm i`
2. Run `node app.js`
3. Open url http://localhost:3000/users

## Feature1: Get list of users
Format of URL: http://localhost:3000/users?min=&max=&offset=&limit=&offset=
How to use: Write value of the param after its `=`. If param is left out or empty, its default value will be used.
Example: To have min of 100.5, use url http://localhost:3000/users?min=100.5
Params:
- min: type is float, default value is 0.0
- max: type is float, default value is 4000.0
- offset: type is int, default value is 0
- limit: type is int, default value is null
- sort: type is string, default value is null
