const express = require('express');
const app = express();
const port = 3000;

const fs = require('fs');
const csvParser = require('csv-parser');
const os = require('os')
const multer = require('multer')
const upload = multer({dest: os.tmpdir()}) // store file uploaded in temp dir

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
            data.salary = parseFloat(data.salary)

            // filter by min and max
            if (data.salary >= min && data.salary <= max) {
                result.push(data);
            }
        })
        .on("end", () => {
            // sort results
            if (sort == 'NAME') {
                result.sort((a, b) => {
                    const first = a.name.toLowerCase();
                    const second = b.name.toLowerCase();
                    if (first < second) {
                        return -1;
                    } else if (first > second) {
                        return 1;
                    }
                    return 0;
                })
            } else if (sort == 'SALARY') {
                result.sort((a, b) => a.salary - b.salary);
            }

            // offset and limit for results 
            var result_cut;
            if (limit == null) {
                result_cut = result.slice(offset);
            } else {
                result_cut = result.slice(offset, offset + limit);
            }

            // return result
            res.status(200).json({"results": result_cut});
        })
})

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file

    const result = [];
    var resped = false;

    fs.createReadStream(file.path)
    .pipe(csvParser({
        skipLines: 1,
        headers: ['name', 'salary'],
        strict: true
    }))
    .on("data", (data) => {
        data.salary = parseFloat(data.salary)
        result.push(data)
    })
    .on("end", () => {
        console.log(result)
        if (!resped) {
            resped = true;
            res.status(200).json({"success": 1});
        }
    })
    .on("error", (e) => {
        if (!resped) {
            resped = true;
            res.status(400).json({"success": 0, "error": e.message});
        }
    })

})

app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}/users`)
})