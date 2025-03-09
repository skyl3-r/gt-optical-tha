const express = require('express');
const app = express();
const port = 3000;

const fs = require('fs');
const csvParser = require('csv-parser');

app.get('/', (req, res) => {
    res.send(`<a href='http://localhost:${port}/users'>Go to users page</a>`);
})

app.get('/users', (req, res) => {
    // get query params
    // if params are invalid, will be changed to default
    const min = parseFloat(req.query.min) || 0.0;
    const max = parseFloat(req.query.max) || 4000.0;
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || null;
    var sort = req.query.sort;
    if (!['NAME', 'SALARY'].includes(sort)) {
        sort = null;
    }

    // console.log(min, max, offset, limit, sort)

    // read data.csv
    const result = [];
    fs.createReadStream("./data.csv")
        .pipe(csvParser({
            skipLines: 1,
            headers: ['name', 'salary']
        }))
        .on("data", (data) => {
            // console.log(data['salary']);
            data['salary'] = parseFloat(data['salary'])
            result.push(data);
        })
        .on("end", () => {
            res.json({"results": result});
        })
})

app.post('/upload', (req, res) => {

})

app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}/users`)
})